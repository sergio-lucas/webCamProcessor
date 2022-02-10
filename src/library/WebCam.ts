import { IWebCamEvents, EventType } from './IWebCamEvents';
import { EventEmitter } from './EventEmitter';

import { throttle, dom } from '../helpers';

import styles from './css/style.module.scss';




export declare interface WebCam {
  on<U extends keyof IWebCamEvents>(event: U, callback: IWebCamEvents[U]): void;
}

enum State {
  Stop,
  Running,
  Pause
}


export class WebCam extends EventEmitter {
  container: HTMLElement;
  camView: HTMLElement;
  video: HTMLVideoElement;
  state: State;
  outputCanvas: HTMLCanvasElement;
  outputCtx: CanvasRenderingContext2D | null;
  stream: MediaStream;

  // frameHandler = throttle(this.onFrame.bind(this), 1000 / 30); // TODO: Throttle function execution
  /**
   * Creates an instance of WebCam.
   * @param {HTMLElement} container
   * @memberof WebCam
   */
  constructor(container: HTMLElement) {
    super();
    if (!container) {
      throw new Error("Please provide a DOM element");
    }

    this.container = container;
    this.camView = this.__createView();
    this.state = State.Stop;

    // resize

    this.container.appendChild(this.camView);

    this.__startup();
    return this;
  }

  onFrame(canvasCtx: CanvasRenderingContext2D | null) {}

  get camera_preview(): HTMLCanvasElement {
    return this.camView.querySelector('#camera_preview');
  }

  private __createView() {
    const view = dom.crEl("div");
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
    this.video = dom.crEl("video");
    this.video.addEventListener( "canplay", this.onCameraReady.bind(this), false );
    this.outputCanvas = this.camera_preview;
    this.outputCtx = this.camera_preview.getContext( "2d" );
    this.video.autoplay = true;
    this.__requestAccess();
  }

  private __nextFrame(ms: number) {
    this.outputCtx.drawImage( this.video, 0, 0, 640, 480 );

    if( this.state === State.Running ) {
      // this.frameHandler.call(this, this.outputCtx);
      this.onFrame(this.outputCtx);
      window.requestAnimationFrame( this.__nextFrame.bind(this) );
    }
  }

  private onCameraReady() {
    this.outputCanvas.width = this.video.videoWidth;
    this.outputCanvas.height = this.video.videoHeight;

    this.emit(EventType.Ready);
  }

  private __requestAccess() {
    navigator.mediaDevices.getUserMedia({"video" : true })
      .then(this.onStream.bind(this))
      .catch(this.onFail)
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

  /**
   * Pause camera streaming
   *
   * @memberof WebCam
   */
  pause() {
    if (this.state === State.Running) {
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
   * @memberof WebCam
   */
  resume() {
    if (this.state !== State.Running) {
      this.__requestAccess();
    }
  }

  /**
   * Stop camera streaming and remove view template
   *
   * @memberof WebCam
   */
  destroy() {
    this.pause();
    this.container.removeChild(this.camView);

    this.emit(EventType.Destroy);
  }
}
