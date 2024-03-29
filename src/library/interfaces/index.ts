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

export interface FaceParams {
  face_image: any;
  face: {
      sW: number;
      sH: number;
      dX: number;
      dY: number;
      dW: any;
      dH: any;
      crX: number;
      crY: number;
      crW: number;
      crH: number;
  };
  dt: number;
}

export interface IFaceCheckEvents {
  ['load']: () => void;
  ['detect']: (data: { type: string, face: FaceParams }) => void;
  ['error']: (msg: string) => void;
  ['failed']: (msg: any) => void; // TODO: check type
}
