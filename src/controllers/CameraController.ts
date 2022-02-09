// get ref to the camera screen
interface IController {
  handleNext(): void;
  handleSkipNeuro(): void;
}


abstract class Controller {
  abstract handleNext(): void
}

class AudioController extends Controller {
  context: Controller;
  constructor(ctx: CameraController) {
    super();
    // this.context = ctx;
  }
  handleNext(): void {
    throw new Error("Method not implemented.");
  }
  handlePlayAudio(): void {
    //
  }
}

class CameraController implements IController {
  handleSkipNeuro(): void {
    throw new Error("Method not implemented.");
  }
  context: Controller;
  handleNext(): void {
    /**
     * 1. Validate face
     * 2. Start calibration
     **/ 
  }
  private deviceId;

  handleSwitchCamera() {}
  handleValidateFace() {}
  handleShowInstruction() {}


}


const cam = new CameraController();
// const withAudio = new AudioController(cam);

cam.handleSwitchCamera
// cam.context.handlePlayAudio();