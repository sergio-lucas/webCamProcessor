export enum EventType {
  Ready = 'ready',
  Pause = 'pause',
  Destroy = 'destroy',
  Failed = 'failed'
};
export interface IWebCamEvents {
  [EventType.Pause]: () => void;
  [EventType.Ready]: () => void;
  [EventType.Destroy]: () => void;
  [EventType.Failed]: (e: Error) => void;
}