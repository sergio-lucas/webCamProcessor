import { IWebCamProcessorEvents } from './IWebCamProcessorEvents';
import { FrameProcessor } from './FrameProcessor';
import { ProcessorController } from './ProcessorController';
import { EventEmitter } from './EventEmitter';

import styles from './css/style.module.scss';


const createElement = (el: string) : any => document.createElement(el);


/**
 * 
 * new (dib, { faceCheck: {processor: func, renderMesh}})
 */

// const defaultProps = {
//   faceCheck: {
//     processor: () => {},
//     renderMesh: false
//   }
// }
{/* <canvas id="mesh_preview"></canvas> */}


export declare interface WebCamProcessor {
  on<U extends keyof IWebCamProcessorEvents>(event: U, callback: IWebCamProcessorEvents[U]): void;
}

enum State {
  Stop,
  Running,
  Pause
}

enum EventType {
  FaceDetected = "face_detected",
  Ready = "ready",
  Pause = "pause",
  Resume = "resume",
  Destroy = "destroy"
};
const myWorker = new Worker("worker.js");

export class WebCamProcessor extends EventEmitter {
  container: HTMLElement;
  camView: HTMLElement;
  video: HTMLVideoElement;
  frameProcessor: ProcessorController;
  state: State;
  outputCanvas: HTMLCanvasElement;
  outputCtx: any;
  stream: MediaStream;
  /**
   * Creates an instance of WebCamProcessor.
   * @param {HTMLElement} container
   * @param {Function} [frameProcessor]
   * @memberof WebCamProcessor
   */
  constructor(container: HTMLElement, frameHandler?: Function) {
    super();
    if (!container) {
      throw new Error("Please provide a DOM element");
    }

    this.container = container;
    this.camView = this.__createView();
    this.frameProcessor = new ProcessorController(new FrameProcessor(this, frameHandler))
    // this.processor = new ProcessorController(new FrameProcessor(this, frameHandler))
    this.state = State.Stop;

    // resize

    this.container.appendChild(this.camView);

    this.__startup();
    return this;
  }

  get camera_preview(): HTMLCanvasElement {
    return this.camView.querySelector('#camera_preview');
  }

  private __createView() {
    const view = createElement("div");
    view.className = styles.webCam;
    view.innerHTML = `
      <div class="${styles.webCam__wrapper}">
        <div class="${styles.webCam__container}">
          <canvas id="camera_preview" class="${styles.webCam__preview}"></canvas>
        </div>
        <div class="${styles.webCam__reloadContainer}">
          <button type="button" class="camera__reload_btn"></button>
        </div>
        <div class="${styles.webCam__infoContainer}">
          <a class="${styles.webCam__setupLink}" href="#">How to set up camera</a>
        </div>
      </div>
    `;

    return view;
  }

  private __startup() {
    this.video = createElement("video");
    this.video.addEventListener( "canplay", this.onCameraReady.bind(this), false );
    this.outputCanvas = this.camera_preview;
    this.outputCtx = this.camera_preview.getContext( "2d" );
    this.video.autoplay = true;
    this.__requestAccess();
  }

  private async __nextFrame(ms: number) {
    try
		{
			this.outputCtx.drawImage( this.video, 0, 0, 640, 480 );
      const rgba = this.outputCtx.getImageData(0, 0, 640, 480);

      myWorker.postMessage(["detect", rgba])

      if( this.state !== State.Stop ) {
        window.requestAnimationFrame( this.__nextFrame.bind(this) );
      }
		} catch {}
  }

  private onCameraReady() {
    this.outputCanvas.width = this.video.videoWidth;
    this.outputCanvas.height = this.video.videoHeight;

    this.emit(EventType.Ready);
  }

  onProcess({ errors, isFaceExist, ms}: { errors: Array<number>, isFaceExist: boolean, ms: number}, cb: Function) {
    this.emit(EventType.FaceDetected)
    cb(errors, isFaceExist, ms);
  }

  private onStream(stream: MediaStream) {
    this.stream = stream;
    this.video.srcObject = stream;

    this.state = State.Running;

    window.requestAnimationFrame(this.__nextFrame.bind(this))
  }
  private onFail(error: any) {
    console.error(error);
    throw new Error("No camera access");
  }
  private __requestAccess() {
    navigator.mediaDevices.getUserMedia({"video" : true })
      .then(this.onStream.bind(this))
      .catch(this.onFail)
  }

  /**
   * Pause camera streaming
   *
   * @memberof WebCamProcessor
   */
  pause() {
    if (this.state === State.Running) {
      // if (this.stream && this.stream.stop) {
      //   this.stream.stop();
      // }
      if (this.stream) {
        this.stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      this.state = State.Pause;
      this.emit(EventType.Pause);
    }
  }

  /**
   * Resume camera streaming
   *
   * @memberof WebCamProcessor
   */
  resume() {
    if (this.state !== State.Running) {
      this.__requestAccess();
    }
  }

  /**
   * Stop camera streaming and remove view template
   *
   * @memberof WebCamProcessor
   */
  destroy() {
    this.container.removeChild(this.camView);

    this.emit(EventType.Destroy);

    // alert("Please dont forget to unsubscribe from events")
  }
}
