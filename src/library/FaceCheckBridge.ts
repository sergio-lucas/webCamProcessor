import { EventEmitter } from "./EventEmitter";
import {BridgeReceivedMessage, IFaceCheckEvents, BridgePostMessage, BridgePostMessageTypes} from "./interfaces";

export declare interface FaceCheckBridge {
  on<U extends keyof IFaceCheckEvents>(event: U, callback: IFaceCheckEvents[U]): void;
}

export class FaceCheckBridge extends EventEmitter {
  worker: Worker;
  url: string | URL;
  constructor(url: string | URL) {
    super();
    this.url = url;
  }
  private init() {
    this.worker = new Worker(this.url);

    this.worker.onmessage = this.onmessageReceive.bind(this);
    this.worker.onerror = this.onError.bind(this);
  }
  onmessageReceive(ev: MessageEvent<BridgeReceivedMessage>) {
    this.emit(ev.data.type, ev.data.payload)
  }

  onError(ev: ErrorEvent) {
    this.emit(ev.type, ev.message)
  }

  postMessage(message: BridgePostMessage, transferableObject?: Transferable[]) {
    this.worker.postMessage(message, transferableObject);
  }

  preloadFaceCheck(data: any) {
    this.init();
    this.postMessage({type: BridgePostMessageTypes.LOAD, payload: data})
  }

  process_frame(data: { originImage: ImageData }, transfer: Transferable[]) {
    this.postMessage({type: BridgePostMessageTypes.PROCESS_FRAME, payload: data }, transfer);
  }

  resetAnchor() {
    this.postMessage({type: BridgePostMessageTypes.RESET_ANCHOR})
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