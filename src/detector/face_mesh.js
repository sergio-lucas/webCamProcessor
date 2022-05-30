function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function prepareWireframeProgram(gl) {
    const vertexShaderSource = `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;
        attribute vec3 aVertexMask;
        attribute vec3 aVertexNormal;
        
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform float uTimeSeconds;

        uniform vec2 uAnchorNearFar;
        uniform vec4 uAnchorBbox;

        varying lowp vec4 vColor;
        varying highp vec3 vVertexPosition;
        varying highp vec3 vBarCoord;

        lowp vec3 goodColor = vec3(0.0, 1.0, 0.0);
        lowp vec3 badColor = vec3(1.0, 0.0, 0.0);

        void main(void) {

            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vVertexPosition = vec3(uModelViewMatrix * aVertexPosition);
            float vertexDistance = length(vVertexPosition) * sign(vVertexPosition.z);
            lowp vec2 viewPosition = vec2(gl_Position.x / gl_Position.z, gl_Position.y / gl_Position.z);
            float distanceFromBbox = max(
                smoothstep(-0.3, 0.1, abs(uAnchorBbox.x - viewPosition.x) - uAnchorBbox.z),
                smoothstep(-0.3, 0.1, abs(uAnchorBbox.y - viewPosition.y) - uAnchorBbox.w)
            );
            distanceFromBbox = max(
                distanceFromBbox,
                smoothstep(0.0, abs(uAnchorNearFar.x - uAnchorNearFar.y), abs(vertexDistance - (0.5 * (uAnchorNearFar.x + uAnchorNearFar.y))))
            );
            float d = distanceFromBbox;

            vColor = vec4(goodColor + d * (badColor - goodColor), 1.0);

            float waveMultiplier = max(
                d,
                smoothstep(0.0, 1.3, sin((aVertexPosition.y * 3.0 + uTimeSeconds * 5.0)))
            );
            vColor *= waveMultiplier;

            vBarCoord = aVertexMask;
        }
    `;
    
    const fragmentShaderSource = `
        varying lowp vec4 vColor;
        varying highp vec3 vBarCoord;
        varying highp vec3 vVertexPosition;
      
        void main(void) {
            highp float d = min(min(vBarCoord.x, vBarCoord.y), vBarCoord.z);
            d = 1.0 - smoothstep(0.0, 0.005 * length(vVertexPosition), d);
            gl_FragColor = vColor * d;
        }
    `;
    const shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            vertexMask: gl.getAttribLocation(shaderProgram, 'aVertexMask'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            display: gl.getUniformLocation(shaderProgram, 'uDisplay'),
            timeSeconds: gl.getUniformLocation(shaderProgram, 'uTimeSeconds'),
            anchorNearFar: gl.getUniformLocation(shaderProgram, 'uAnchorNearFar'),
            anchorBbox: gl.getUniformLocation(shaderProgram, 'uAnchorBbox'),
        }
    }
    return programInfo;
}

function loadVAFromSTLBuffer(model_buffer) {
    let p = 80;
    let faces = new Uint32Array(model_buffer.slice(p, p += 4))[0];

    const data = new Float32Array(faces * 39);

    for (let i = 0; i < data.length; i += 39) {
        let n = new Float32Array(model_buffer.slice(p, p += 12));
        let v1 = new Float32Array(model_buffer.slice(p, p += 12));
        let v2 = new Float32Array(model_buffer.slice(p, p += 12));
        let v3 = new Float32Array(model_buffer.slice(p, p += 12));

        data.set(v1, i);
        data.set(n, i + 3);
        data.set([0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0], i + 6);
        data.set(v2, i + 13);
        data.set(n, i + 16);
        data.set([0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0], i + 19);
        data.set(v3, i + 26);
        data.set(n, i + 29);
        data.set([0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0], i + 32);

        p += 2;
    }

    return {
        data: data,
        faceCount: faces
    }
}

async function getFaceMesh(gl) {
    const model_buffer_response = await fetch('lib/faceDetection/assets/face_model.stl');
    const model_buffer = await model_buffer_response.arrayBuffer();
    const data = loadVAFromSTLBuffer(model_buffer);

    const data_buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data_buf);
    gl.bufferData(gl.ARRAY_BUFFER, data.data, gl.STATIC_DRAW);
    const indices_buf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Array.from({ length: (data.faceCount * 3) + 1 }, (_, i) => i)), gl.STATIC_DRAW);

    const programInfo = prepareWireframeProgram(gl);
    const faceCount = data.faceCount;

    return {
        draw: function(face_processor_result, fc_allowed_bbox) {
            try {
            const rec_params = face_processor_result.reconstruction_params_buffer;

            const deg2radMul = Math.PI / 180;
            // TODO
            // Fix FOV issue
            const fieldOfView = 40.0 * deg2radMul;
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const zNear = 0.1;
            const zFar = 100.0;
            const projectionMatrix = mat4.create();

            mat4.perspective(projectionMatrix,
                             fieldOfView,
                             aspect,
                             zNear,
                             zFar);

            const modelViewMatrix = mat4.create();

            mat4.rotate(modelViewMatrix,
                        modelViewMatrix,
                        rec_params[3] * deg2radMul,
                        [0, 1, 0]);
            mat4.rotate(modelViewMatrix,
                        modelViewMatrix,
                        rec_params[4] * deg2radMul,
                        [1, 0, 0]);
            mat4.translate(modelViewMatrix,
                        modelViewMatrix,
                        [-0.0, 0.0, rec_params[5]]);
            mat4.rotate(modelViewMatrix,
                        modelViewMatrix,
                        rec_params[2] * deg2radMul,
                        [0, 0, 1]);
            mat4.rotate(modelViewMatrix,
                        modelViewMatrix,
                        rec_params[1] * deg2radMul,
                        [0, 1, 0]);
            mat4.rotate(modelViewMatrix,
                        modelViewMatrix,
                        rec_params[0] * deg2radMul,
                        [1, 0, 0]);


            gl.bindBuffer(gl.ARRAY_BUFFER, data_buf);
            const stride = 52;
            {
              const numComponents = 3;
              const type = gl.FLOAT;
              const normalize = false;
              const offset = 0;
              gl.vertexAttribPointer(
                  programInfo.attribLocations.vertexPosition,
                  numComponents,
                  type,
                  normalize,
                  stride,
                  offset);
              gl.enableVertexAttribArray(
                  programInfo.attribLocations.vertexPosition);
            }
            {
              const numComponents = 3;
              const type = gl.FLOAT;
              const normalize = false;
              const offset = 12;
              gl.vertexAttribPointer(
                  programInfo.attribLocations.vertexNormal,
                  numComponents,
                  type,
                  normalize,
                  stride,
                  offset);
              gl.enableVertexAttribArray(
                  programInfo.attribLocations.vertexNormal);
            }
            {
              const numComponents = 4;
              const type = gl.FLOAT;
              const normalize = false;
              const offset = 24;
              gl.vertexAttribPointer(
                  programInfo.attribLocations.vertexColor,
                  numComponents,
                  type,
                  normalize,
                  stride,
                  offset);
              gl.enableVertexAttribArray(
                  programInfo.attribLocations.vertexColor);
            }
            {
              const numComponents = 3;
              const type = gl.FLOAT;
              const normalize = false;
              const offset = 40;
              gl.vertexAttribPointer(
                  programInfo.attribLocations.vertexMask,
                  numComponents,
                  type,
                  normalize,
                  stride,
                  offset);
              gl.enableVertexAttribArray(
                  programInfo.attribLocations.vertexMask);
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buf);

            gl.useProgram(programInfo.program);

            gl.uniformMatrix4fv(
                programInfo.uniformLocations.projectionMatrix,
                false,
                projectionMatrix);
            gl.uniformMatrix4fv(
                programInfo.uniformLocations.modelViewMatrix,
                false,
                modelViewMatrix);

            gl.uniform1f(
                programInfo.uniformLocations.timeSeconds,
                performance.now() * 0.001
            )

            gl.uniform2f(
                programInfo.uniformLocations.anchorNearFar,
                fc_allowed_bbox[2], fc_allowed_bbox[5]
            )

            gl.uniform4f(
                programInfo.uniformLocations.anchorBbox,
                fc_allowed_bbox[0], fc_allowed_bbox[1],
                fc_allowed_bbox[3], fc_allowed_bbox[4]
            )

            {
              const vertexCount = faceCount * 3;
              const type = gl.UNSIGNED_SHORT;
              const offset = 0;
              gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
            }
        } catch(e) {
            debugger
        }
        }
    }
}

function prepare2DTextureProgram(gl) {
    const vertexShaderSource = `
        attribute vec2 aVertexUV;
        attribute vec2 aVertexPosition;

        uniform mat3 uTexturePosition;

        varying lowp vec2 vVertexUV;
        
        void main(void) {

            gl_Position = vec4(uTexturePosition * vec3(aVertexPosition, 1.0), 1.0);
            vVertexUV = aVertexUV;
        }
    `;
    
    const fragmentShaderSource = `
        varying lowp vec2 vVertexUV;

        uniform sampler2D uSampler;
      
        void main(void) {
            gl_FragColor = texture2D(uSampler, vVertexUV);
        }
    `;
    const shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexUV: gl.getAttribLocation(shaderProgram, 'aVertexUV'),
        },
        uniformLocations: {
            texturePosition: gl.getUniformLocation(shaderProgram, 'uTexturePosition'),
            sampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        }
    }
    return programInfo;
}

async function getSprite(gl, textureUrl) {
    const data_buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data_buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // x y u v
        -1.0, -1.0, 0.0, 0.0,
        1.0 , -1.0, 1.0, 0.0,
        1.0 , 1.0 , 1.0, 1.0,
        -1.0, -1.0, 0.0, 0.0,
        1.0 , 1.0 , 1.0, 1.0,
        -1.0, 1.0 , 0.0, 1.0,
    ]), gl.STATIC_DRAW);
    const indices_buf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Array.from({ length: (2 * 3) + 1 }, (_, i) => i)), gl.STATIC_DRAW);

    const programInfo = prepare2DTextureProgram(gl);
    const faceCount = 2;

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    {
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 0, 0]);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            pixel
        );
        const image = new Image();
        image.onload = function() {
            function isPowerOf2(value) {
                return (value & (value - 1)) == 0;
            }

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                          srcFormat, srcType, image);

            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
               gl.generateMipmap(gl.TEXTURE_2D);
            } else {
               gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
               gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
               gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        }
        image.src = textureUrl;
    }

    return {
        draw: function(position, angle, scale) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(programInfo.uniformLocations.sampler, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, data_buf);
            const stride = 16;
            {
              const numComponents = 2;
              const type = gl.FLOAT;
              const normalize = false;
              const offset = 0;
              gl.vertexAttribPointer(
                  programInfo.attribLocations.vertexPosition,
                  numComponents,
                  type,
                  normalize,
                  stride,
                  offset);
              gl.enableVertexAttribArray(
                  programInfo.attribLocations.vertexPosition);
            }
            {
              const numComponents = 2;
              const type = gl.FLOAT;
              const normalize = false;
              const offset = 8;
              gl.vertexAttribPointer(
                  programInfo.attribLocations.vertexUV,
                  numComponents,
                  type,
                  normalize,
                  stride,
                  offset);
              gl.enableVertexAttribArray(
                  programInfo.attribLocations.vertexUV);
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buf);

            gl.useProgram(programInfo.program);

            gl.uniformMatrix3fv(
                programInfo.uniformLocations.texturePosition,
                false,
                new Float32Array([
                    scale * Math.cos(angle), scale * -Math.sin(angle), 0.0,
                    scale * Math.sin(angle), scale * Math.cos(angle), 0.0,
                    position[0], position[1], 1.0
                ])
            )

            {
              const vertexCount = faceCount * 3;
              const type = gl.UNSIGNED_SHORT;
              const offset = 0;
              gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
            }
        }
    }
}

async function getSceneVisualizer(gl, faceChecker) {

    const faceMesh = await getFaceMesh(gl);
    const arrow = await getSprite(gl, '/lib/faceDetection/assets/arrow.png');

    return {
        draw: function(frame_report, fc_frame_report) {
            if (!fc_frame_report) {
                return
            }
            let display = frame_report.face_confidence > faceChecker.face_check_params.face_confidence_threshold;

            let errors = faceChecker.check_head(
                frame_report,
                fc_frame_report
            );

            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clearDepth(1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            if (display) {
                faceMesh.draw(
                    frame_report,
                    faceChecker.get_bbox(fc_frame_report)
                );
            }
            gl.clear(gl.DEPTH_BUFFER_BIT);

            // Draw 2D sprites
            if (errors.includes(6)) {
                arrow.draw([0.0, 0.5], 0.0, 0.15);
            }
            else if (errors.includes(7)) {
                arrow.draw([0.0, 0.5], Math.PI, 0.15);
            }
            if (errors.includes(8)) {
                arrow.draw([0.5, 0.0], Math.PI * 0.5, 0.15);
            }
            else if (errors.includes(9)) {
                arrow.draw([0.5, 0.0], Math.PI * -0.5, 0.15);
            }
        }
    }
}

const mesh = {
    getSceneVisualizer
}

export default mesh;