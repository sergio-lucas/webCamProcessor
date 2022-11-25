import { IWebCamEvents, EventType } from './IWebCamEvents';
import { EventEmitter } from './EventEmitter';
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
  __state: State = State.Stop;
  __stream: MediaStream;
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  video: any;

  constructor(canvasElement: HTMLCanvasElement) {
    super();
    this.canvasElement = canvasElement;
    this.ctx = canvasElement.getContext( '2d' );

    this.video = dom.crEl('video');
    this.video.addEventListener( 'canplay', this.__onCameraReady.bind(this), false );
    this.video.autoplay = true;
  }

  /**
    * @private
  */
  __onCameraReady():void {
    this.canvasElement.width = this.video.videoWidth;
    this.canvasElement.height = this.video.videoHeight;
    window.requestAnimationFrame(this.__renderFrame.bind(this));
  }

  __renderFrame(): void {
    this.ctx.drawImage( this.video, 0, 0, 640, 480 );
    this.onRenderFrame(this.ctx);
    window.requestAnimationFrame( this.__renderFrame.bind(this) );
  }

  __onstartStream(stream: MediaStream): void {
    this.__state = State.Running;
    this.video.srcObject = stream;
  }

  __onFailStream(error: any): void {
    this.emit(EventType.Failed, error);
    throw new Error('No camera access');
  }

  __onStopStream(): void {
    this.__state = State.Stop;
    this.emit(EventType.Pause);
  }

  get isStreamActive(): boolean {
    return this.__stream?.active ?? false;
  }

  get stream(): MediaStream {
    return this.__stream;
  }

  /**
   * Request camera stream
   *
   * @memberof WebCam
   */
  requestAccess(): Promise<MediaStream> {
    if (this.__state === State.Stop) {
      return navigator.mediaDevices.getUserMedia({'video' : true })
        .then(this.__onstartStream.bind(this))
        .catch(this.__onFailStream.bind(this));
    }
  }

  /**
   * Stop camera streaming
   *
   * @memberof WebCam
   */
  stopStream() {
    if (this.__state === State.Running) {
      this.__stream.getTracks().forEach(track => {
        track.stop();
      });
      this.__onStopStream();
    }
  }

  /**
   * Call this action on each frame request
   *
   * @memberof WebCam
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onRenderFrame(context: CanvasRenderingContext2D) {}
}
