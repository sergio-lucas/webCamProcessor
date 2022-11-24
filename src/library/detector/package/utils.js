
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8);
    getFloat64Memory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4);
    getUint32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
*
* Performs perspective projection of 3D points provided with `pts_3d` using `rec_params` as
* source for transformation extrinsics matrix.
*
* The result is stored in `pts_2d_out`.
*
* `pts_2d_out` buffer MUST be preallocated before function call.
*
* # Arguments
*
* * `pts_3d` - array of source 3D points in format [x1, y1, z1, ..., xn, yn, zn].
* * `frame_size` - 2-element array containing frame width and height in pixels.
* * `rec_params` - 6-element array containing face reconstruction result received from
* [reconstruction][crate::reconstruction].
* * `fov` - user's camera diagonal field on view in degrees. If unknown, should be set to 50.
* * `pts_2d_out` - array of target 2D points in format [x1, y1, ..., xn, yn].
*
* # JS Types
*
* Following Rust -> JS type mappings can be used to supply parameters to this function:
*
* * `[f64] -> Float64Array`;
* * `[u32] -> Uint32Array`;
*
* Number types e.g. f64 correspond to regular number primitives.
*
* @param {Float64Array} pts_3d
* @param {Uint32Array} frame_size
* @param {Float64Array} rec_params
* @param {number} fov
* @param {Float64Array} pts_2d_out
*/
export function project(pts_3d, frame_size, rec_params, fov, pts_2d_out) {
    try {
        var ptr0 = passArrayF64ToWasm0(pts_3d, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passArray32ToWasm0(frame_size, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passArrayF64ToWasm0(rec_params, wasm.__wbindgen_malloc);
        var len2 = WASM_VECTOR_LEN;
        var ptr3 = passArrayF64ToWasm0(pts_2d_out, wasm.__wbindgen_malloc);
        var len3 = WASM_VECTOR_LEN;
        wasm.project(ptr0, len0, ptr1, len1, ptr2, len2, fov, ptr3, len3);
    } finally {
        pts_2d_out.set(getFloat64Memory0().subarray(ptr3 / 8, ptr3 / 8 + len3));
        wasm.__wbindgen_free(ptr3, len3 * 8);
    }
}

/**
*
* Performs 3D face reconstruction (alignment).
*
* The result is stored in `result_buf` in format: `[pitch, yaw, roll, alpha, beta, tz]`.
*
* * `pitch` - head pitch angle in radians;
* * `yaw` - head yaw angle in radians;
* * `roll` - head roll angle in radians;
* * `alpha` - head horizontal shift angle in radians;
* * `beta` - head vertical shift angle in radians;
* * `tz` - distance from head to origin (camera position), unitless.
*
* `result_buf` buffer MUST be preallocated before function call.
*
* # Arguments
*
* * `landmarks` - array of 68 2D facial landmarks in format [x1, y1, ..., x68, y68] in pixels.
* * `frame_size` - 2-element array containing frame width and height in pixels.
* * `fov` - user's camera diagonal field on view in degrees. If unknown, can be set to 50.
* * `result_buf` - 6-element array to store result.
*
* # JS Types
*
* Following Rust -> JS type mappings can be used to supply parameters to this function:
*
* * `[f64] -> Float64Array`;
* * `[u32] -> Uint32Array`;
*
* Number types e.g. f64 correspond to regular number primitives.
* @param {Float64Array} landmarks
* @param {Uint32Array} frame_size
* @param {number} fov
* @param {Float64Array} result_buf
*/
export function reconstruction(landmarks, frame_size, fov, result_buf) {
    try {
        var ptr0 = passArrayF64ToWasm0(landmarks, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passArray32ToWasm0(frame_size, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passArrayF64ToWasm0(result_buf, wasm.__wbindgen_malloc);
        var len2 = WASM_VECTOR_LEN;
        wasm.reconstruction(ptr0, len0, ptr1, len1, fov, ptr2, len2);
    } finally {
        result_buf.set(getFloat64Memory0().subarray(ptr2 / 8, ptr2 / 8 + len2));
        wasm.__wbindgen_free(ptr2, len2 * 8);
    }
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachegetFloat32Memory0 = null;
function getFloat32Memory0() {
    if (cachegetFloat32Memory0 === null || cachegetFloat32Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachegetFloat32Memory0;
}

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4);
    getFloat32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
*
* Crops rectangular region from source image, resizes it and stores the result into target
* buffer.
*
* Interpolation algorithm is determined automatically based on image and sampling regions sizes.
*
* `target_image_buf` buffer MUST be preallocated before function call.
*
* Both `src_image_buf` and `target_image_buf` are not required to exactly match provided image
* dimentions, but have to contain enough space to store corresponding image data.
*
* # Arguments
*
* * `src_image_buf` - raw image RGBA pixel data in format: [r1, g1, b1, a1, ..., rn, gn, bn, an];
* * `src_width` - width of source image in pixels;
* * `src_height` - height of source image in pixels;
* * `src_bbox` - bounding box of cropping region in format [x, y, w, h], where:
*    * `x` - region center x-coordinate in pixels;
*    * `y` - region center y-coordinate in pixels;
*    * `w` - region width in pixels;
*    * `h` - region height in pixels.
* * `target_image_buf` - raw image RGB pixel data in format: [r1, g1, b1, ..., rm, gm, bm] to
* store result into;
* * `target_width` - width of target image in pixels to resize into;
* * `target_height` - height of target image in pixels to resize into;
*
* # JS Types
*
* Following Rust -> JS type mappings can be used to supply parameters to this function:
*
* * `[f32] -> Float32Array`;
* * `[u8] -> Uint8Array`;
*
* Number types e.g. usize, u32 correspond to regular number primitives.
*
* # Example
*
* ```js
* let sourceImage = new Uint8Array(
*     640 * // width
*     480 * // height
*     4     // channels
* );
* let croppedImage = new Uint8Array(
*     64 *  // width
*     64 *  // height
*     3     // channels
* );
*
* // This call will crop 100x100 region from center of source image, resize it to 64x64 and store
* into targetImage.
* roi(
*     sourceImage,
*     640, 480,
*     [
*         320, 240, // frame center
*         100, 100
*     ],
*     croppedImage,
*     64, 64
* )
* ```
* @param {Uint8Array} src_image_buf
* @param {number} src_width
* @param {number} src_height
* @param {Float32Array} src_bbox
* @param {Uint8Array} target_image_buf
* @param {number} target_width
* @param {number} target_height
*/
export function roi(src_image_buf, src_width, src_height, src_bbox, target_image_buf, target_width, target_height) {
    try {
        var ptr0 = passArray8ToWasm0(src_image_buf, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passArrayF32ToWasm0(src_bbox, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passArray8ToWasm0(target_image_buf, wasm.__wbindgen_malloc);
        var len2 = WASM_VECTOR_LEN;
        wasm.roi(ptr0, len0, src_width, src_height, ptr1, len1, ptr2, len2, target_width, target_height);
    } finally {
        target_image_buf.set(getUint8Memory0().subarray(ptr2 / 1, ptr2 / 1 + len2));
        wasm.__wbindgen_free(ptr2, len2 * 1);
    }
}

/**
*
* Computes face blur index for provided region of image
*
* # Arguments
*
* * `src_image_buf` - raw image RGBA pixel data in format: [r1, g1, b1, a1, ..., rn, gn, bn, an];
* * `src_width` - width of source image in pixels;
* * `src_height` - height of source image in pixels;
* * `src_bbox` - bounding box of region in format [x, y, w, h], where:
*    * `x` - region center x-coordinate in pixels;
*    * `y` - region center y-coordinate in pixels;
*    * `w` - region width in pixels;
*    * `h` - region height in pixels.
*
* # Returns
* Face blur index as float value
*
* # JS Types
*
* Following Rust -> JS type mappings can be used to supply parameters to this function:
*
* * `[f32] -> Float32Array`;
* * `[u8] -> Uint8Array`;
*
* Number types e.g. u32 correspond to regular number primitives.
* @param {Uint8Array} src_image_buf
* @param {number} src_width
* @param {number} src_height
* @param {Float32Array} src_bbox
* @returns {number}
*/
export function face_blur(src_image_buf, src_width, src_height, src_bbox) {
    var ptr0 = passArray8ToWasm0(src_image_buf, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passArrayF32ToWasm0(src_bbox, wasm.__wbindgen_malloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.face_blur(ptr0, len0, src_width, src_height, ptr1, len1);
    return ret;
}

/**
*
* Encodes image and saves it as JPEG buffer with provided compression quality
*
* `target_jpeg_buf` buffer MUST be preallocated before function call.
*
* As it is not trivial to compute encoded image buffer size for given image without performing
* actual encoding, `target_jpeg_buf` can be allocated with size equal to maximum image data size,
* which is exprected to be encoded.
*
* For example, if it is known, that maximum encoded image will have size 256x256,
* `target_jpeg_buf` size can be set as 256 * 256 * 3.
*
* This is based on the assumption that for any image, it's encoded size will at worst case equal
* to it's raw size.
*
* # Arguments
*
* * `src_image_buf` - raw image RGB pixel data in format: [r1, g1, b1, ..., rn, gn, bn];
* * `src_width` - width of source image in pixels;
* * `src_height` - height of source image in pixels;
* * `target_jpeg_buf` - buffer to store encoded image.
* * `quality` - compression quality. Must be in range [1; 100].
*
* # Returns
* Number of bytes written
*
* # JS Types
*
* Following Rust -> JS type mappings can be used to supply parameters to this function:
*
* * `[f32] -> Float32Array`;
* * `[u8] -> Uint8Array`;
*
* Number types e.g. u32 correspond to regular number primitives.
*
* # Example
*
* ```js
* let sourceImage = new Uint8Array(
*     640 * // width
*     480 * // height
*     4     // channels
* );
* let croppedImage = new Uint8Array(
*     64 *  // width
*     64 *  // height
*     3     // channels
* );
*
* // As we are going to encode 64x64 RGB image,
* // this buffer has to be at least 64 * 64 * 3 bytes
* let jpegBuffer = new Uint8Array(
*     64 * 64 * 3
* );
*
* // Crop 64x64 image
* roi_area(
*     sourceImage,
*     640, 480,
*     [
*         320, 240, // frame center
*         100, 100
*     ],
*     targetImage,
*     64, 64,
*     1
* )
*
* // Encode cropped image
* let size = encode_jpeg(
*     croppedImage,
*     64, 64,
*     jpegBuffer,
*     90
* );
*
* // Get first "size" bytes
* let encoded = jpegBuffer.slice(0, size);
* ```
* @param {Uint8Array} src_image_buf
* @param {number} src_width
* @param {number} src_height
* @param {Uint8Array} target_jpeg_buf
* @param {number} quality
* @returns {number}
*/
export function encode_jpeg(src_image_buf, src_width, src_height, target_jpeg_buf, quality) {
    try {
        var ptr0 = passArray8ToWasm0(src_image_buf, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passArray8ToWasm0(target_jpeg_buf, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.encode_jpeg(ptr0, len0, src_width, src_height, ptr1, len1, quality);
        return ret >>> 0;
    } finally {
        target_jpeg_buf.set(getUint8Memory0().subarray(ptr1 / 1, ptr1 / 1 + len1));
        wasm.__wbindgen_free(ptr1, len1 * 1);
    }
}

/**
*
* Encodes image and saves it as PNG buffer
*
* `target_png_buf` buffer MUST be preallocated before function call.
*
* As it is not trivial to compute encoded image buffer size for given image without performing
* actual encoding, `target_png_buf` can be allocated with size equal to maximum image data size,
* which is exprected to be encoded.
*
* For example, if it is known, that maximum encoded image will have size 256x256,
* `target_png_buf` size can be set as 256 * 256 * 3.
*
* This is based on the assumption that for any image, it's encoded size will at worst case equal
* to it's raw size.
*
* # Arguments
*
* * `src_image_buf` - raw image RGB pixel data in format: [r1, g1, b1, ..., rn, gn, bn];
* * `src_width` - width of source image in pixels;
* * `src_height` - height of source image in pixels;
* * `target_png_buf` - buffer to store encoded image.
*
* # Returns
* Number of bytes written
*
* # JS Types
*
* Following Rust -> JS type mappings can be used to supply parameters to this function:
*
* * `[f32] -> Float32Array`;
* * `[u8] -> Uint8Array`;
*
* Number types e.g. u32 correspond to regular number primitives.
*
* # Example
*
* ```js
* let sourceImage = new Uint8Array(
*     640 * // width
*     480 * // height
*     4     // channels
* );
* let croppedImage = new Uint8Array(
*     64 *  // width
*     64 *  // height
*     3     // channels
* );
*
* // As we are going to encode 64x64 RGB image,
* // this buffer has to be at least 64 * 64 * 3 bytes
* let pngBuffer = new Uint8Array(
*     64 * 64 * 3
* );
*
* // Crop 64x64 image
* roi_area(
*     sourceImage,
*     640, 480,
*     [
*         320, 240, // frame center
*         100, 100
*     ],
*     targetImage,
*     64, 64,
*     1
* )
*
* // Encode cropped image
* let size = encode_png(
*     croppedImage,
*     64, 64,
*     pngBuffer
* );
*
* // Get first "size" bytes
* let encoded = pngBuffer.slice(0, size);
* ```
* @param {Uint8Array} src_image_buf
* @param {number} src_width
* @param {number} src_height
* @param {Uint8Array} target_png_buf
* @returns {number}
*/
export function encode_png(src_image_buf, src_width, src_height, target_png_buf) {
    try {
        var ptr0 = passArray8ToWasm0(src_image_buf, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passArray8ToWasm0(target_png_buf, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.encode_png(ptr0, len0, src_width, src_height, ptr1, len1);
        return ret >>> 0;
    } finally {
        target_png_buf.set(getUint8Memory0().subarray(ptr1 / 1, ptr1 / 1 + len1));
        wasm.__wbindgen_free(ptr1, len1 * 1);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
/**
* @param {Uint8Array | undefined} a
* @returns {number | undefined}
*/
export function wasm_test(a) {
    var ptr0 = isLikeNone(a) ? 0 : passArray8ToWasm0(a, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.wasm_test(ptr0, len0);
    return ret === 0xFFFFFF ? undefined : ret;
}

/**
* @param {number} timestamp
* @param {number | undefined} content_timestamp
* @param {number} output_mask
* @param {Uint8Array | undefined} src_image_buf
* @param {number | undefined} src_image_width
* @param {number | undefined} src_image_height
* @param {Float32Array | undefined} face_bbox
* @param {Float32Array | undefined} landmarks
* @param {Float32Array | undefined} left_pupiil
* @param {Float32Array | undefined} right_pupil
* @param {Float32Array | undefined} left_blink
* @param {Float32Array | undefined} right_blink
* @param {Float32Array | undefined} angles
* @param {Float32Array | undefined} pog
* @param {Float32Array | undefined} confidence
* @param {Float32Array | undefined} attention
* @param {Float32Array | undefined} emotions
* @param {Float32Array | undefined} emotions_va
* @param {Uint8Array} target_message_buf
* @returns {number}
*/
export function prepare_frame_message(timestamp, content_timestamp, output_mask, src_image_buf, src_image_width, src_image_height, face_bbox, landmarks, left_pupiil, right_pupil, left_blink, right_blink, angles, pog, confidence, attention, emotions, emotions_va, target_message_buf) {
    try {
        var ptr0 = isLikeNone(src_image_buf) ? 0 : passArray8ToWasm0(src_image_buf, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(face_bbox) ? 0 : passArrayF32ToWasm0(face_bbox, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(landmarks) ? 0 : passArrayF32ToWasm0(landmarks, wasm.__wbindgen_malloc);
        var len2 = WASM_VECTOR_LEN;
        var ptr3 = isLikeNone(left_pupiil) ? 0 : passArrayF32ToWasm0(left_pupiil, wasm.__wbindgen_malloc);
        var len3 = WASM_VECTOR_LEN;
        var ptr4 = isLikeNone(right_pupil) ? 0 : passArrayF32ToWasm0(right_pupil, wasm.__wbindgen_malloc);
        var len4 = WASM_VECTOR_LEN;
        var ptr5 = isLikeNone(left_blink) ? 0 : passArrayF32ToWasm0(left_blink, wasm.__wbindgen_malloc);
        var len5 = WASM_VECTOR_LEN;
        var ptr6 = isLikeNone(right_blink) ? 0 : passArrayF32ToWasm0(right_blink, wasm.__wbindgen_malloc);
        var len6 = WASM_VECTOR_LEN;
        var ptr7 = isLikeNone(angles) ? 0 : passArrayF32ToWasm0(angles, wasm.__wbindgen_malloc);
        var len7 = WASM_VECTOR_LEN;
        var ptr8 = isLikeNone(pog) ? 0 : passArrayF32ToWasm0(pog, wasm.__wbindgen_malloc);
        var len8 = WASM_VECTOR_LEN;
        var ptr9 = isLikeNone(confidence) ? 0 : passArrayF32ToWasm0(confidence, wasm.__wbindgen_malloc);
        var len9 = WASM_VECTOR_LEN;
        var ptr10 = isLikeNone(attention) ? 0 : passArrayF32ToWasm0(attention, wasm.__wbindgen_malloc);
        var len10 = WASM_VECTOR_LEN;
        var ptr11 = isLikeNone(emotions) ? 0 : passArrayF32ToWasm0(emotions, wasm.__wbindgen_malloc);
        var len11 = WASM_VECTOR_LEN;
        var ptr12 = isLikeNone(emotions_va) ? 0 : passArrayF32ToWasm0(emotions_va, wasm.__wbindgen_malloc);
        var len12 = WASM_VECTOR_LEN;
        var ptr13 = passArray8ToWasm0(target_message_buf, wasm.__wbindgen_malloc);
        var len13 = WASM_VECTOR_LEN;
        var ret = wasm.prepare_frame_message(timestamp, !isLikeNone(content_timestamp), isLikeNone(content_timestamp) ? 0 : content_timestamp, output_mask, ptr0, len0, !isLikeNone(src_image_width), isLikeNone(src_image_width) ? 0 : src_image_width, !isLikeNone(src_image_height), isLikeNone(src_image_height) ? 0 : src_image_height, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5, ptr6, len6, ptr7, len7, ptr8, len8, ptr9, len9, ptr10, len10, ptr11, len11, ptr12, len12, ptr13, len13);
        return ret >>> 0;
    } finally {
        target_message_buf.set(getUint8Memory0().subarray(ptr13 / 1, ptr13 / 1 + len13));
        wasm.__wbindgen_free(ptr13, len13 * 1);
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('assets/utils_bg.wasm', self.location.origin);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_error_94583a5d23ebb2e4 = function(arg0, arg1) {
        console.error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_now_559193109055ebad = function(arg0) {
        var ret = getObject(arg0).now();
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_64cc7d048f228ca8 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_98117e9a7e993920 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_process_2f24d6544ea7b200 = function(arg0) {
        var ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        var ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_versions_6164651e75405d4a = function(arg0) {
        var ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_4b517d861cbcb3bc = function(arg0) {
        var ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        var ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_modulerequire_3440a4bcf44437db = function() { return handleError(function (arg0, arg1) {
        var ret = module.require(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_crypto_98fc271021c7d2ad = function(arg0) {
        var ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_msCrypto_a2cdb043d2bfe57f = function(arg0) {
        var ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newnoargs_be86524d73f67598 = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_4d0f21c2f823742e = function() { return handleError(function (arg0, arg1) {
        var ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_888d259a5fefc347 = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_c6fbdfc2918d5e58 = function() { return handleError(function () {
        var ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_baec038b5ab35c54 = function() { return handleError(function () {
        var ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_3f735a5746d41fbd = function() { return handleError(function () {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_1bc0b39582740e95 = function() { return handleError(function () {
        var ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_buffer_397eaa4d72ee94dd = function(arg0) {
        var ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_a7ce447f15ff496f = function(arg0) {
        var ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_969ad0a60e51d320 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_length_1eb8fc608a0d4cdb = function(arg0) {
        var ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_929232475839a482 = function(arg0) {
        var ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_8b658422a224f479 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        var ret = debugString(getObject(arg1));
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        var ret = wasm.memory;
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

