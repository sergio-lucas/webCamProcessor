// export enum BridgeReceivedMessageTypes {
//   LOAD = 'LOAD',
//   FAILED = 'FAILED',
//   DETECT = 'DETECT',
// };

export type BridgeReceivedMessageTypes = 'load' | 'failed' | 'detect' | 'error';

export interface BridgeReceivedMessage {
  type: BridgeReceivedMessageTypes,
  payload?: any,
  error?: any,
};

export enum BridgePostMessageTypes {
  'LOAD' = 'load',
  'PROCESS_FRAME' = 'process_frame',
  'RESET_ANCHOR' = 'reset_anchor',
}

export interface BridgePostMessage {
  type: BridgePostMessageTypes,
  payload?: any
}

/**
 * Represents parameters for processing a face.
 */
export interface FaceParams {
  /** The face image data. */
  face_image: any;
  
  /** 
   * Details about the face.
   */
  face: {
    /** The source width of the face image. */
    sW: number;
    /** The source height of the face image. */
    sH: number;
    /** The destination X coordinate for rendering the face. */
    dX: number;
    /** The destination Y coordinate for rendering the face. */
    dY: number;
    /** The destination width for rendering the face. */
    dW: any; // Type not specified
    /** The destination height for rendering the face. */
    dH: any; // Type not specified
    /** The cropping X coordinate for the face. */
    crX: number;
    /** The cropping Y coordinate for the face. */
    crY: number;
    /** The cropping width for the face. */
    crW: number;
    /** The cropping height for the face. */
    crH: number;
  };
  
  /** The timestamp of the face data. */
  dt: number;
}

export interface IFaceCheckEvents {
  ['load']: () => void;
  ['detect']: (data: { type: string, face: FaceParams }) => void;
  ['error']: (msg: string) => void;
  ['failed']: (msg: any) => void; // TODO: check type
}
