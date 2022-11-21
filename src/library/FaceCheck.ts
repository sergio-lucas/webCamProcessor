// const FPSMeter = require('fps-m');
import { WebCam } from './WebCam';
import { FaceCheckBridge } from './FaceCheckBridge';
import { throttle } from '../helpers';
import {getConfig} from '../helpers/config';

let cameraCanvas:WebCam = null;
const bridge = new FaceCheckBridge("worker.js");

const processorFn = (context: CanvasRenderingContext2D | null) => {
  const rgba = context.getImageData(0, 0, 640, 480);

  bridge.process_frame({
      originImage: rgba
    }, [rgba.data.buffer]);
};

const startFaceDetector = () => {
  cameraCanvas.onRenderFrame = throttle(processorFn, 1000 / 30);;
};

const stopFaceDetector = () => {
  cameraCanvas.onRenderFrame = () => {};
}

const faceCheckerConfig = {
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
}

bridge.on("load", () => {
  console.log("Face detector loaded");
  // startFaceDetector();
});
bridge.on("detect", (data) => {
  console.log("detected");
  // startFaceDetector();
});
bridge.on("error", (msg) => {
  console.log(msg);
})

export const App = {
  pauseDetector: stopFaceDetector,
  startDetector: startFaceDetector,
  loadDetector: () => {
    bridge.preloadFaceCheck(faceCheckerConfig);
  },
  destroyDetector: () => {
    bridge.destroy();
  },
  captureFrame: () => {
    // processorFn(cameraCanvas.outputCtx);

    // const frame = cameraCanvas.outputCanvas.toDataURL("image/jpeg").slice(23);

    // return frame;
  },
  resetAnchor: () => {
    bridge.resetAnchor();
  },
  mount: (domEl: HTMLCanvasElement, config: any = {}) => {
    const appConfig = getConfig(config);
    // if (appConfig.dev) {
    //   (new FPSMeter({ui: true})).start();
    // }
    cameraCanvas = new WebCam(domEl);
    cameraCanvas.requestAccess()
    // webcam.on("ready", () => {
      
    // })
    // cameraCanvas = new WebCam(domEl);
    // return cameraCanvas;
  }
}

/*
app = App.mount(camera_holder)
App.loadDetector()
App.startDetector()
App.pauseDetector()
App.killDetector()
*/