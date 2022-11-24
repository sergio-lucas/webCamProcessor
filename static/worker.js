// extract this file on local server
// minify on build
// move to ts folder
try {
  importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.7.0/dist/tf.min.js");
  importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite/dist/tf-tflite.min.js");
  importScripts("https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js");
  importScripts("wasm_library.js");
} catch (e) {
  throw new Error("Error loading library")
}

let face_processor;
let faceChecker;
let wasm = null;
let fc_results = null;
const loadDeps = async (faceCheckerConfig) => {
    try {
      const tf_model = await wasm_library.preLoadTFModel('./assets/model.tflite', () => {});

      face_processor = await wasm_library.loadFaceProcessor(50.0, tf_model);
      faceChecker = wasm_library.loadFaceChecker(faceCheckerConfig);

      postMessage({ type: 'load' });
    } catch (e) {
      postMessage({ type: 'failed', payload: e });
      console.error(e);
      throw new Error("Could not load face detector")
    }
  }

  const onWasmLibInit = (lib) => {
    wasm = lib;
    bufferData = allocateImagesBuffer();
  }

  const init = (payload) => {
    wasm_library.init()
      .then(onWasmLibInit)
      .then(() => loadDeps(payload))
      .catch((e) => {
        console.log(e);
      })
  }

const allocateImagesBuffer = () => {
  return {
    source: new Uint8Array(256 * 256 * 3),
    target: new Uint8Array(256 * 256 * 3)
  }
}
const cropImage = (rgba) => {
  const [faceX, faceY, faceWidth, faceHeight] = face_processor.face_bbox.map(e => Math.round(e));

  const [facePadX, facePadY, facePadWidth, facePadHeight] = [
    faceX, faceY, faceWidth * 1.5, faceHeight * 1.5
  ];

  const [maxWidth, maxHeight] = [
    Math.min(256, Math.round(facePadWidth)),
    Math.min(256, Math.round(facePadHeight))
  ];

  try {
    wasm.roi(
      rgba.data, rgba.width, rgba.height,
      [facePadX, facePadY, facePadWidth, facePadHeight],
      bufferData.source, maxWidth, maxHeight
    )
  } catch(e) {
    console.log(e);
    throw new Error("Roi error");
  }

  const bufferSize = wasm.encode_jpeg(bufferData.source, maxWidth, maxHeight, bufferData.target, 85); // TODO: Make image quality configurable
  const encoded = bufferData.target.slice(0, bufferSize);

  return {
    face_image: encoded,
    face: {
      sW: 640, // TODO: Extract video params
      sH: 480, // TODO: Extract video params
      dX: faceX - faceWidth / 2,
      dY: faceY - faceHeight / 2,
      dW: faceWidth,
      dH: faceHeight,
      crX: facePadX - facePadWidth / 2,
      crY: facePadY - facePadHeight / 2,
      crW: facePadWidth,
      crH: facePadHeight
    },
    dt: 0 // TODO: processing time. find way how to implement this
  }
}
const processFrame = (rgba, rgbaBuffer) => {
  // Simulate getting frame from face control
  if (!fc_results && (face_processor.face_confidence[0] > 0.5)) {
    fc_results = face_processor.clone_results();
  }

  if (!fc_results) return;

  const errors = faceChecker.check_head(
      face_processor,
      fc_results
  );
  let faceData = cropImage(rgba);
      faceData.errors = errors;

  postMessage({
    type: 'detect',
    payload: faceData
  }, [faceData.face_image.buffer]);
}

const resetAnchor = () => {
  fc_results = null;
}
const detect = async ({originImage}) => {
  if (!face_processor) return;
  await face_processor.process_frame(originImage);

  processFrame(originImage, originImage.data);
}

onmessage = function(e) {
  const {type, payload} = e.data;

  switch (type) {
    case 'load':
      init(payload);
      break;
    case 'start':
      // startDetector
    case 'stop':
      // stopDetector
    case 'show_mesh':
    case 'hide_mesh':
    case 'reset_anchor':
      resetAnchor();
      break;
    case 'process_frame':
      detect(payload);
      break;
  }
}