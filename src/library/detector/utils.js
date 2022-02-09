import * as wasm from "./package/utils.js";
// import * as tflite from '@tensorflow/tfjs-tflite';

function preLoadTFModel(url, onProgress) {
    return new Promise((res, rej) => {
        fetch(url)
          // .then(
          //   ProgressFetch.progress({
          //     onProgress: onProgress,
          //     onError: rej
          //   })
          // )
          .then(r => r.arrayBuffer())
          .then(res)
          .catch(rej)
    })
}

async function loadFaceProcessor(camera_fov, model) {
    // Model description:
    // Inputs:
    //
    // - 128x128 RGB uint8 image
    //
    // Outputs:
    // - Vector with following components:
    // -- Face presence confidence (from 0 to 1)
    // -- Face bbox: x, y, w, h in frame coordinates (upper left corner - (0, 0), bottom right corner - (1, 1))
    // -- 68 facial landmarks in format x1, y1, x2, y2, ..., x68, y68
    // -- Left eye quality (from 0 to 1)
    // -- Right eye quality (from 0 to 1)
    //
    // [ conf | bbox | landmarks | left eye q | right eye q ]
    // [  1   |  4   |    136    |     1      |      1      ]
    //let tf_model = await tf.loadGraphModel('/model/model.json');
    // let progress_model = await preLoadModel(onProgress);
    let tf_model = await tflite.loadTFLiteModel(model);
    let input_size = [
        128, 128
    ];

    return {
        frame_size: [],
        camera_fov: camera_fov,
        resized_image_buffer: new Uint8Array(input_size[0] * input_size[1] * 3),
        landmarks_buffer: new Float64Array(136),
        reconstruction_params_buffer: new Float64Array(6),
        face_confidence: new Float64Array(1),
        face_bbox: new Float64Array(4),
        eye_quality: new Float64Array(2),
        blur: new Float64Array(1),

        stage_time: new Float64Array(4),

        clone_results: function () {
            return {
                frame_size: this.frame_size,
                camera_fov: camera_fov,
                landmarks_buffer: [...this.landmarks_buffer],
                reconstruction_params_buffer: [...this.reconstruction_params_buffer],
                face_confidence: [...this.face_confidence],
                face_bbox: [...this.face_bbox],
                eye_quality: [...this.eye_quality],
                blur: [...this.blur]
            }
        },

        _process: async function (
            rgba,
            out_face_confidence,
            out_face_bbox,
            out_landmarks_buffer,
            out_reconstruction_params_buffer,
            out_eye_quality,
            out_blur
        ) {
            let ts = [performance.now()];
            let s = Math.max(rgba.width, rgba.height);
            let pad_x = (s - rgba.width) / 2;
            let pad_y = (s - rgba.height) / 2;

            wasm.roi(
                rgba.data, rgba.width, rgba.height,
                [rgba.width / 2, rgba.height / 2, s, s],
                this.resized_image_buffer, input_size[0], input_size[1]
            )
            ts.push(performance.now());
            let pred = await tf_model.predict(
                tf.tensor4d(
                    this.resized_image_buffer,
                    [1, input_size[1], input_size[0], 3],
                    'float32'
                )
            ).data();
            ts.push(performance.now());

            out_face_confidence[0] = pred[0];
            out_face_bbox[0] = pred[1] * s - pad_x;
            out_face_bbox[1] = pred[2] * s - pad_y;
            out_face_bbox[2] = pred[3] * s;
            out_face_bbox[3] = pred[4] * s;

            for (let i = 5; i < 5 + 136; i+=2) {
                out_landmarks_buffer[i - 5] = pred[i    ] * s - pad_x;
                out_landmarks_buffer[i - 4] = pred[i + 1] * s - pad_y;
            }

            if (out_eye_quality) {
                out_eye_quality[0] = pred[141];
                out_eye_quality[1] = pred[142];
            }

            wasm.reconstruction(
                out_landmarks_buffer,
                [rgba.width, rgba.height],
                this.camera_fov,
                out_reconstruction_params_buffer
            )
            ts.push(performance.now());

            if (out_blur) {
                out_blur[0] = wasm.face_blur(
                    rgba.data, rgba.width, rgba.height,
                    this.face_bbox
                );
            }
            ts.push(performance.now());

            for (let i = 0; i < 4; i++) {
                this.stage_time[i] += ((ts[i + 1] - ts[i]) - this.stage_time[i]) * 0.1;
            }
        },

        process_frame: async function (rgba) {
            this.frame_size = [rgba.width, rgba.height];
            await this._process(
                rgba,
                this.face_confidence,
                this.face_bbox,
                this.landmarks_buffer,
                this.reconstruction_params_buffer,
                this.eye_quality,
                this.blur
            )
        },
        project: async function (pts_3d) {
            let pts_2d = new Float64Array(2 * pts_3d.length / 3);

            wasm.project(
                pts_3d,
                this.frame_size,
                this.reconstruction_params_buffer,
                this.camera_fov,
                pts_2d
            );

            return pts_2d
        }
    }
}

function loadFaceChecker(face_check_params) {
    return {
        face_check_params: face_check_params,
        get_bbox: function (fc_frame_report) {
            const p = new Float32Array([0, 0, 0]);
            let lt = new Float32Array(2);
            let rb = new Float32Array(2);

            let b = new Float32Array(fc_frame_report.reconstruction_params_buffer);
            b[3] -= face_check_params.alpha_thresh;
            b[4] -= face_check_params.beta_thresh;
            wasm.project(
                p,
                [2.0, 2.0],
                b,
                fc_frame_report.camera_fov,
                lt
            )
            lt[0] -= 1.0;
            lt[1] -= 1.0;
            b[3] += face_check_params.alpha_thresh * 2.0;
            b[4] += face_check_params.beta_thresh * 2.0;
            wasm.project(
                p,
                [2.0, 2.0],
                b,
                fc_frame_report.camera_fov,
                rb
            )
            rb[0] -= 1.0;
            rb[1] -= 1.0;

            let s = Math.max(fc_frame_report.frame_size[0], fc_frame_report.frame_size[1]);
            let pad_x = (s - fc_frame_report.frame_size[0]) / 2;
            let pad_y = (s - fc_frame_report.frame_size[1]) / 2;

            const modelShift = 1.0;
            return new Float32Array([
                1.0 - 2.0 * fc_frame_report.face_bbox[0] / fc_frame_report.frame_size[0],
                1.0 - 2.0 * fc_frame_report.face_bbox[1] / fc_frame_report.frame_size[1],
                (1 - face_check_params.tz_thresh) * (fc_frame_report.reconstruction_params_buffer[5] + modelShift),
                2.0 * fc_frame_report.face_bbox[2] / fc_frame_report.frame_size[0],
                2.0 * fc_frame_report.face_bbox[3] / fc_frame_report.frame_size[1],
                (1 + face_check_params.tz_thresh) * (fc_frame_report.reconstruction_params_buffer[5] + modelShift),
            ]);
        },
        check_head: function (
            frame_report,
            fc_frame_report
        ) {
            let errors = [];

            [
                face_check_params.rx_thresh,
                face_check_params.ry_thresh,
                face_check_params.rz_thresh,
                face_check_params.alpha_thresh,
                face_check_params.beta_thresh
            ].map((t, i) => {
                if ((frame_report.reconstruction_params_buffer[i] - fc_frame_report.reconstruction_params_buffer[i]) > t) {
                    errors.push(2 * i);
                } else if ((frame_report.reconstruction_params_buffer[i] - fc_frame_report.reconstruction_params_buffer[i]) < -t) {
                    errors.push(2 * i + 1);
                }
            })

            if ((1 - frame_report.reconstruction_params_buffer[5] / fc_frame_report.reconstruction_params_buffer[5]) > face_check_params.tz_thresh) {
                errors.push(10);
            } else if ((1 - frame_report.reconstruction_params_buffer[5] / fc_frame_report.reconstruction_params_buffer[5]) < -face_check_params.tz_thresh) {
                errors.push(11);
            }

            return errors;
        }
    }
}

export {
    preLoadTFModel,
    loadFaceProcessor,
    loadFaceChecker
}

export default wasm;