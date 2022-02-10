/**
 * A Camera Device's video format. Do not create instances of this type yourself.
 */

export enum EventType {
  FaceDetected = "face_detected",
  Ready = "ready",
  Pause = "pause",
  Destroy = "destroy"
};
export interface IWebCamEvents {
  [EventType.Pause]: () => void;
  [EventType.Ready]: () => void;
  [EventType.FaceDetected]: () => void;
  [EventType.Destroy]: () => void;
}