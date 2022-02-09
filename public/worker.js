importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.7.0/dist/tf.min.js");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite/dist/tf-tflite.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js");

importScripts("detector/wasm_library.js");

let frame_processor;
let faceChecker;
wasm = null;
const loadDeps = async () => {
    try {
      // add wasm loading, tflite, bson, buffer
      const tf_model = await wasm_library.preLoadTFModel('./detector/assets/model.tflite', () => {});
      faceChecker = wasm_library.loadFaceChecker({
                    face_confidence_threshold: 2,
                    face_control_delay: 2,
                    rx_thresh: 20,
                    ry_thresh: 20,
                    rz_thresh: 20,
                    alpha_thresh: 5,
                    beta_thresh: 5,
                    tz_thresh: 0.15,
                    frame_quality: 100,
                    check_interval: 2000
                  });
      frame_processor = await wasm_library.loadFaceProcessor(50.0, tf_model);
    } catch (e) {
      console.error(e);
      throw new Error("Could not load face detector")
    }
  }
  // loadDeps();
  wasm_library.init().then((e) => {
    wasm = e;
    loadDeps();
  })

const detect = async (rgba) => {
  if (!frame_processor) return;
  await frame_processor.process_frame(rgba);
}

onmessage = function(e) {
  const type = e.data[0];
  const message = e.data[1];

  switch (type) {
    case 'load':
      loadDeps();
      break;
    case 'detect':
      detect(message);
      break;
  }
}