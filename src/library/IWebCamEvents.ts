export enum EventType {
  Ready = 'ready',
  Pause = 'pause',
  Destroy = 'destroy',
  Failed = 'failed'
};
export interface IWebCamEvents {
  [EventType.Pause]: (evt: string) => void;
  [EventType.Ready]: (evt: string) => void;
  [EventType.Destroy]: (evt: string) => void;
  [EventType.Failed]: (e: Error) => void;
}