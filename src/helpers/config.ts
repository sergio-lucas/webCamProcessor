// import env
const defaultURLConfig = {
  faceControlUrl: "test", // 
  calibrationUrl: "test", // load on init or before calibration ?
  faceCheckParamsUrl: "test", // load on init
  tfModelUrl: "test", // load on init
  stlSource: "", // load on init
  wasmPackage: "", // load on init
  dev: false
};

export const getURLConfig = (params = {}) => {
  return {...defaultConfig, ...params}
}

export const defaultConfig = {
  detector: {
    face_confidence_threshold: 2,
    face_control_delay: 2,
    rx_thresh: 20,
    ry_thresh: 20,
    rz_thresh: 20,
    alpha_thresh: 5,
    beta_thresh: 5,
    tz_thresh: 0.15,
    frame_quality: 100,
    check_interval: 2000
  }
}

/**
 * Implement loader to load resources one by one 
 * 
 */