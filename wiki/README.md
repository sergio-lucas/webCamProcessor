**libraries** • **Docs**

***

# Face detector for web browser docs
This detector was tested on different browsers;

### API Documentation :card_index_dividers:	

API docs can be found here: [API](https://sergio-lucas.github.io/webCamProcessor/docs/api/), a modern static website generator.

### TODO checklist :white_check_mark:
- [x] obfuscation of destination code for
- [x] check api docs build for
- [x] add link to documentation
- [ ] minify code changes
- [ ] move worker into detector folder (move face_mesh, utils, wasm_helper to helper folder in detector folder)
- [ ] convert webworker to ts file process it and minimize
- [ ] add examples to docs
- [ ] unit tests
- [ ] integration tests for main detector
- [ ] remove unused files
- [ ] refactor config files
- [ ] download external dependencies and put it into repo
- [ ] eslint+prettier+airbnb
- [ ] validate eslint errors before push on commit!
- [ ] remove any from code
- [ ] fix Error Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true. See: https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently

## Response example :information_source:	
```
{
  face_image: encoded,
  errors: [
    9,
    11
  ],
  face: {
    "sW": 640,
    "sH": 480,
    "dX": 210.5,
    "dY": 419,
    "dW": 151,
    "dH": 104,
    "crX": 172.75,
    "crY": 393,
    "crW": 226.5,
    "crH": 156
  },
  dt: 0
}
```

## API Index

### Classes

- [EventEmitter](classes/EventEmitter.md)

### Interfaces

- [IEventEmitter](interfaces/IEventEmitter.md)
