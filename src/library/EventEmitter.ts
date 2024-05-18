/**
  * This module is a simple implementation of the EventEmitter pattern.
  * 
  * It allows to subscribe/unsubscribe to events and emit them.
  * 
  * @module EventEmitter
  * 
  */

type EmitterPayload = (payload: any) => void;

export interface IEventEmitter {
  on: (event: string, callback: EmitterPayload) => void;
  off: (event: string, callback: EmitterPayload) => void;
}
// TODO: write test cases for this file

/**
 * EventEmitter class
 *
 * @export
 * @class EventEmitter
 * @implements {IEventEmitter}
 * 
 * @example
 * ```ts
 * const emitter = new EventEmitter();
 * emitter.on('event', (payload) => console.log(payload));
 * emitter.emit('event', 'Hello, world!');
 * ```
 */
export class EventEmitter implements IEventEmitter {
  private events = new Map();
  
  /**
   * Add event listener. Push it to the events array and invoke by calling emit
   *
   * @param {string} event
   * @param {EmitterPayload} callback
   * @memberof EventEmitter
   */
  on(event: string, callback: EmitterPayload) {
    if (!this.events.get(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }

  /**
   * Remove event listener. Remove callback from array
   *
   * @param {string} event
   * @param {EmitterPayload} callback
   * @memberof EventEmitter
   */
  off(event: string, callback: EmitterPayload) {
    const eventToDelete = this.events.get(event).filter((eventCb: EmitterPayload) => eventCb === callback);

    if (eventToDelete.length !== 0) {
      this.events.set(event, this.events.get(event).filter((cbs: EmitterPayload) => cbs !== callback));
    }

    // eventToDelete.forEach(this.events.delete);
  }

  protected emit(event: string, payload?: EmitterPayload) {
    const eventArray = this.events.get(event);

    if (eventArray?.length > 0) {
      eventArray.forEach((callback: EmitterPayload) => callback.call(null, payload));
    }
  }
}