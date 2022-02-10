import { EventEmitter } from "./EventEmitter";

interface FaceParams {
  face_image: any;
  face: {
      sW: number;
      sH: number;
      dX: number;
      dY: number;
      dW: any;
      dH: any;
      crX: number;
      crY: number;
      crW: number;
      crH: number;
  };
  dt: number;
}

interface IFaceCheckEvents {
  ['load']: () => void;
  ['detect']: (data: { type: string, face: FaceParams }) => void;
}

export declare interface FaceCheckBridge {
  on<U extends keyof IFaceCheckEvents>(event: U, callback: IFaceCheckEvents[U]): void;
}

export class FaceCheckBridge extends EventEmitter {
  worker: Worker;
  constructor(url: string | URL) {
    super();
    this.worker = new Worker(url);

    this.worker.onmessage = this.onmessageReceive.bind(this);
  }
  onmessageReceive(ev: MessageEvent<any>) {
    if (!ev.data.type) return;
    this.emit(ev.data.type, ev.data.data)
  }

  preloadFaceCheck(data: any) {
    this.worker.postMessage({type: "load", payload: data})
  }

  process_frame(data: { originImage: ImageData }, transfer: Transferable[]) {
    this.worker.postMessage({type: "process_frame", payload: data }, transfer);
  }

  resetAnchor() {
    this.worker.postMessage({type: "reset_anchor"})
  }

  destroy() {
    this.worker.terminate();
  }
}

// const worker = new TestWorker("ur");
// worker.on('load', fn);
// worker.on('load_failed', fn);
// worker.on('face_detected', fn);

// worker.stopDetection();
// worker.startDetection();
// worker.resetFaceAnchor