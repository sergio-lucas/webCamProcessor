const getCameraList = async() => {
  try {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    const cameras = mediaDevices.filter((device) => device.kind === "videoinput")

    return cameras;
  } catch (error) {
    console.log(error); // log error to system

    throw new Error("Could not retrieve device list");
  }
};

const requestCamera = async (cameraId) => {
  try {
    const constrains = {
      audio: false,
      video: {
        deviceId: cameraId ? {exact: cameraId} : undefined
      }
    };
    const stream = await navigator.mediaDevices.getUserMedia(constrains);
    return stream;
  } catch (error) {
    console.log(error);
    
    throw new Error("Permission denied");
  }
};

function stopCamera(stream): void {
  stream.getTracks().forEach((track) => {
    if (track.readyState == 'live' && track.kind === 'video') {
      track.stop();
    }
    // stream.getVideoTracks().forEach(function (track) {
    //     track.stop();
    // });
  });
}

// const VideoMimeTypes = [
//   'video/webm;codecs=vp9',
//   'video/webm;codecs=vp8',
//   'video/webm'
// ];

// const getSupportedMediaType = () => {
//   const currentMimeType = VideoMimeTypes.find((mime) => MediaRecorder.isTypeSupported(mime));
//   return currentMimeType;
// }