import {
	preLoadTFModel,
	loadFaceProcessor,
	loadFaceChecker 
} from 'utils';

async function loadWasm() {
    let wasm = await import('./package/utils.js');
    await wasm.default()

    return wasm;
}


// loadWasm()
// 	.then((e) => {
// 		window.wasm = e;
// 		window.preLoadTFModel = preLoadTFModel;
// 		window.loadFaceProcessor = loadFaceProcessor;
// 		window.loadFaceChecker = loadFaceChecker;
// 	})
// 	.catch((error) => {
// 		throw new Error("Couldn't load wasm file: " + error);
// 	})

const Library = {
	init: loadWasm,
	preLoadTFModel,
	loadFaceProcessor,
	loadFaceChecker
};

export default Library;