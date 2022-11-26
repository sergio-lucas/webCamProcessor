import {IWebCamEvents, EventType} from './IWebCamEvents';
import {EventEmitter} from './EventEmitter';
import {dom} from '../helpers/dom';

export declare interface WebCam {
  on<U extends keyof IWebCamEvents>(event: U, callback: IWebCamEvents[U]): void;
}

enum State {
  Stop,
  Running,
  Pause
}


export class WebCam extends EventEmitter {
  /**
   * My diary.
   * @private
   */
  state: State = State.Stop;

  stream: MediaStream;

  canvasElement: HTMLCanvasElement;

  ctx: CanvasRenderingContext2D;

  video: any;

  constructor(canvasElement: HTMLCanvasElement) {
    super();
    this.canvasElement = canvasElement;
    this.ctx = canvasElement.getContext( '2d' );

    this.video = dom.crEl('video');
    this.video.addEventListener( 'canplay', this.onCameraReady.bind(this), false );
    this.video.autoplay = true;
  }

  /**
    * @private
  */
  onCameraReady():void {
    const test = 1;
    this.canvasElement.width = this.video.videoWidth;
    this.canvasElement.height = this.video.videoHeight;
    window.requestAnimationFrame(this.renderFrame.bind(this));
  }
  
  renderFrame() {
    this.ctx.drawImage( this.video, 0, 0, 640, 480 );
    this.onRenderFrame(this.ctx);
    window.requestAnimationFrame( this.renderFrame.bind(this) );

    return '';
  }

  onstartStream(stream: MediaStream): void {
    this.state = State.Running;
    this.video.srcObject = stream;
  }

  onFailStream(error: any): void {
    this.emit(EventType.Failed, error);
    throw new Error('No camera access');
  }

  onStopStream(): void {
    this.state = State.Stop;
    this.emit(EventType.Pause);
  }

  get isStreamActive(): boolean {
    return this.stream?.active ?? false;
  }

  /**
   * Request camera stream
   *
   * @memberof WebCam
   */
  requestAccess(): Promise<MediaStream> {
    if (this.state === State.Stop) {
      return navigator.mediaDevices.getUserMedia({'video' : true})
        .then(this.onstartStream.bind(this))
        .catch(this.onFailStream.bind(this));
    }
    return Promise.resolve(this.stream);
  }

  /**
   * Stop camera streaming
   *
   * @memberof WebCam
   */
  stopStream() {
    if (this.state === State.Running) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      this.onStopStream();
    }
  }

  /**
   * Call this action on each frame request
   *
   * @memberof WebCam
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function, class-methods-use-this
  onRenderFrame(context: CanvasRenderingContext2D) {}
}