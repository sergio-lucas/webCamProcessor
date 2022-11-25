type CallbackFn = (a: string) => void;

export interface IEventEmitter {
  on: (event: string, callback: CallbackFn) => void;
  off: (event: string, callback: CallbackFn) => void;
}
// TODO: write test cases for this file

export class EventEmitter implements IEventEmitter {
  private events = new Map();
  
  /**
   * Add event listener. Push it to the events array and invoke by calling emit
   *
   * @param {string} event
   * @param {CallbackFn} callback
   * @memberof EventEmitter
   */
  on(event: string, callback: CallbackFn) {
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
  off(event: string, callback: CallbackFn) {
    const eventToDelete = this.events.get(event).filter((eventCb: CallbackFn) => eventCb === callback);

    if (eventToDelete.length !== 0) {
      this.events.set(event, this.events.get(event).filter((cbs: any) => cbs !== callback));
    }

    // eventToDelete.forEach(this.events.delete);
  }
  protected emit(event: string, payload?: any) {
    const eventArray = this.events.get(event);

    if (eventArray?.length > 0) {
      eventArray.forEach((callback: CallbackFn) => callback.call(null, payload));
    }
  }
}