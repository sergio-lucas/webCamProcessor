export interface IEventEmitter {
  on: (event: string, callback: Function) => void;
  off: (event: string, callback: Function) => void;
}

export class EventEmitter implements IEventEmitter {
  private events = new Map();
  
  /**
   * Add event listener. Push it to the events array and invoke by calling emit
   *
   * @param {string} event
   * @param {Function} callback
   * @memberof EventEmitter
   */
  on(event: string, callback: Function) {
    !this.events.get(event) && this.events.set(event, []);
    this.events.get(event).push(callback);
  }
  /**
   * Remove event listener. Remove callback from array
   *
   * @param {string} event
   * @param {Function} callback
   * @memberof EventEmitter
   */
  off(event: string, callback: Function) {
    this.events.get(event).filter((eventCb: Function) => eventCb === callback);
  }
  protected emit(event: string, payload?: Object) {
    const eventArray = this.events.get(event);

    if (eventArray?.length > 0) {
      eventArray.forEach((callback: Function) => callback.call(null, payload));
    }
  }
}