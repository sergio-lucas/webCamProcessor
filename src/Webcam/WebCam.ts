import { IWebCamEvents, EventType } from './IWebCamEvents';
import { EventEmitter } from '../EventEmitter/EventEmitter';

export declare interface WebCam {
  on<U extends keyof IWebCamEvents>(event: U, callback: IWebCamEvents[U]): void;
}

enum State {
  Stop,
  Running,
  Pause
}


export class WebCam extends EventEmitter {
  #state: State = State.Stop;
  #stream: MediaStream;

  #onstartStream(stream: MediaStream) {
    this.#stream = stream;
    this.#onReadyStream();
  }

  #onFailStream(error: any) {
    this.emit(EventType.Failed, error);
    this.#state = State.Stop;
    // throw new Error("No camera access");
  }

  #onReadyStream() {
    this.#state = State.Running;
    this.emit(EventType.Ready);
  }
  #onStopStream() {
    this.#state = State.Stop;
    this.emit(EventType.Pause);
  }

  get isStreamActive() {
    return this.#stream?.active ?? false;
  }

  get stream() {
    return this.#stream;
  }

  /**
   * Request camera stream
   *
   * @memberof WebCam
   */
  requestAccess() {
    if (this.#state === State.Stop) {
      navigator.mediaDevices.getUserMedia({"video" : true })
        .then(this.#onstartStream.bind(this))
        .catch(this.#onFailStream.bind(this))
    }
  }

  /**
   * Stop camera streaming
   *
   * @memberof WebCam
   */
  stopStream() {
    if (this.#state === State.Running) {
      this.#stream.getTracks().forEach(track => {
        track.stop();
      });
      this.#onStopStream();
    }
  }
}
