// const FPSMeter = require('fps-m');
import {WebCam} from './WebCam';
import {FaceCheckBridge} from './FaceCheckBridge';

import {throttle} from '../helpers';
import {defaultConfig} from '../helpers/config';

export const faceDetector = (config: any = defaultConfig) => {
  const {detector} = config;
  // 
  const bridge = new FaceCheckBridge("worker.js");
  bridge.preloadFaceCheck(detector);
  bridge.on("error", () => {
    console.log('load error')
    // retry preload on Error loading library/ define custom error type
    // clear on forceStop
  });
  const processorFn = (context: CanvasRenderingContext2D | null) => {
    const rgba = context.getImageData(0, 0, 640, 480);

    bridge.process_frame({
        originImage: rgba
      }, [rgba.data.buffer]);
  };
  return (canvas: HTMLCanvasElement) => {
    const cameraCanvas: WebCam = new WebCam(canvas);

    const requestAccess = () => cameraCanvas.requestAccess();

    requestAccess();

    const setInitialFacePosition = () => {
      bridge.resetAnchor();
    };

    const startDetecting = () => {
      cameraCanvas.onRenderFrame = throttle(processorFn, 1000 / 30);
    };

    const stopDetecting = () => {
      cameraCanvas.onRenderFrame = () => {};
    };

    const takeSnapshotFromStream = () => {
      processorFn(cameraCanvas.ctx);

      return cameraCanvas.canvasElement.toDataURL("image/jpeg").slice(23);
    };

    const stop = () => {
      bridge.destroy();
    };

    const onDetect = (cb: any) => {//payload == data?
      bridge.on("detect", cb);

      return () => bridge.off("detect", cb);
    }

    const onError = (cb: any) => {//msg ==str
      bridge.on("error", cb);

      return () => bridge.off("error", cb);
    };

    const onLoad = (cb: any) => {
      bridge.on("load", cb);

      return () => bridge.off("load", cb);
    };

    const forceStop = () => {};

    return {
      setInitialFacePosition,
      startDetecting,
      stopDetecting,
      takeSnapshotFromStream,
      stop,
      onDetect,
      onError,
      onLoad,
      forceStop,
    }
  }
};

// const initiator = faceDetector(config);
// const detector = initiator(canvas);
// const unsubscribe = detector.onDetect(fn)
// const unsubscribe()
//const unsubscribe = detector.onLoad(fn)
//fn = startFaceDetector();??