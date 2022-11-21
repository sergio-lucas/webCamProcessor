// import env
const defaultConfig = {
  faceControlUrl: "test", // 
  calibrationUrl: "test", // load on init or before calibration ?
  faceCheckParamsUrl: "test", // load on init
  tfModelUrl: "test", // load on init
  stlSource: "", // load on init
  wasmPackage: "", // load on init
  dev: false
};

export const getConfig = (params = {}) => {
  return {...defaultConfig, ...params}
}

/**
 * Implement loader to load resources one by one 
 * 
 */