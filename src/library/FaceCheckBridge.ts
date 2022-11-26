import {EventEmitter} from './EventEmitter';
import {BridgeReceivedMessage, IFaceCheckEvents, BridgePostMessage, BridgePostMessageTypes} from './interfaces';

export declare interface FaceCheckBridge {
  on<U extends keyof IFaceCheckEvents>(event: U, callback: IFaceCheckEvents[U]): void;
}

export class FaceCheckBridge extends EventEmitter {
  worker: Worker;

  url: string | URL;

  // eslint-disable-next-line no-use-before-define
  instance: FaceCheckBridge;

  constructor(url: string | URL) {
    super();
    if (this.instance) {
      throw new Error('You can have only 1 instance of FaceDetector due to performance issues');
    }
    this.url = url;
    this.instance = this;
  }

  private init() {
    this.worker = new Worker(this.url);

    this.worker.onmessage = this.onmessageReceive.bind(this);
    this.worker.onerror = this.onError.bind(this);
  }

  onmessageReceive(ev: MessageEvent<BridgeReceivedMessage>) {
    this.emit(ev.data.type, ev.data.payload);
  }

  // eslint-disable-next-line class-methods-use-this
  onError(ev: ErrorEvent) {
    // this.emit(ev.type, ev.message);
  }

  postMessage(message: BridgePostMessage, transferableObject?: Transferable[]) {
    this.worker.postMessage(message, transferableObject);
  }

  preloadFaceCheck(data: any) {
    this.init();
    this.postMessage({type: BridgePostMessageTypes.LOAD, payload: data});
  }

  process_frame(data: { originImage: ImageData }, transfer: Transferable[]) {
    this.postMessage({type: BridgePostMessageTypes.PROCESS_FRAME, payload: data}, transfer);
  }

  resetAnchor() {
    this.postMessage({type: BridgePostMessageTypes.RESET_ANCHOR});
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