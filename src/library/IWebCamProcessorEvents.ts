/**
 * A Camera Device's video format. Do not create instances of this type yourself.
 */
export interface IWebCamProcessorEvents {
  'pause': () => void;
  'ready': () => void;
  'face_detected': () => void;
  'destroy': () => void;
}