import { WebCamProcessor } from './WebCamProcessor';
import { Processor } from './ProcessorController';
import wasm_library from './detector/wasm_helper';
import face_mesh from './detector/face_mesh';
const fc_results: any = null;
export class FrameProcessor extends Processor {
  handleProcess: Function;
  webCamProcessor: WebCamProcessor;
  frame_processor: any;
  faceChecker: any;
  constructor(webCamProcessor: WebCamProcessor, handleProcess: Function) {
    super();
    this.webCamProcessor = webCamProcessor;
    this.handleProcess = handleProcess;

    
  }

  async load(onLoad: Function) {
    await this.loadDeps(onLoad);
    this.faceChecker = this.initFaceChecker({
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
    })
    // this.initVisualizer();
  }

  private initFaceChecker(face_check_params: any) {
    return wasm_library.loadFaceChecker(face_check_params)
  }

  // private initVisualizer() {
  //   return face_mesh.getSceneVisualizer(gl, this.faceChecker);
  // }

  onProgress(progress: any) {
    // this.webCamProcessor.emit("progress", progress);
  }

  async loadDeps(onReady: Function) {
    try {
      // add wasm loading, tflite, bson, buffer
      const tf_model = await wasm_library.preLoadTFModel('./detector/assets/model.tflite', this.onProgress.bind(this));
      this.frame_processor = await wasm_library.loadFaceProcessor(50.0, tf_model);

      // onReady();
    } catch (e) {
      console.error(e);
      throw new Error("Could not load face detector")
    }
  }

  getErrors() {
    // const errors = faceChecker.check_head(
    //   this.frame_processor,
    //   fc_results
    // );

    // return errors
  }

  async process(ms: number) {
    // const rgba = this.ctx.getImageData(0, 0, this.webCamProcessor.outputCanvas.width, this.webCamProcessor.outputCanvas.height);

    // await this.frame_processor.process_frame(rgba);

    // // Simulate getting frame from face control
    // if (!fc_results && (this.frame_processor.face_confidence[0] > 0.8)) {
    //     fc_results = this.frame_processor.clone_results();
    // }

    // const errors = this.getErrors();
    // const isFaceExist = face_conf > 0.8;

    // this.webCamProcessor.onProcess({ errors, isFaceExist, ms }, this.handleProcess);
  }
}