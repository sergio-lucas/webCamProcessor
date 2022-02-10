---
id: "WebCam"
title: "Class: WebCam"
sidebar_label: "WebCam"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- [`EventEmitter`](EventEmitter.md)

  ↳ **`WebCam`**

## Constructors

### constructor

• **new WebCam**(`container`)

Creates an instance of WebCam.

**`memberof`** WebCam

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `HTMLElement` |

#### Inherited from

[EventEmitter](EventEmitter.md).[constructor](EventEmitter.md#constructor)

#### Defined in

[WebCam.ts:36](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L36)

## Properties

### camView

• **camView**: `HTMLElement`

#### Defined in

[WebCam.ts:24](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L24)

___

### container

• **container**: `HTMLElement`

#### Defined in

[WebCam.ts:23](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L23)

___

### outputCanvas

• **outputCanvas**: `HTMLCanvasElement`

#### Defined in

[WebCam.ts:27](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L27)

___

### outputCtx

• **outputCtx**: `CanvasRenderingContext2D`

#### Defined in

[WebCam.ts:28](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L28)

___

### state

• **state**: `State`

#### Defined in

[WebCam.ts:26](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L26)

___

### stream

• **stream**: `MediaStream`

#### Defined in

[WebCam.ts:29](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L29)

___

### video

• **video**: `HTMLVideoElement`

#### Defined in

[WebCam.ts:25](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L25)

## Accessors

### camera\_preview

• `get` **camera_preview**(): `HTMLCanvasElement`

#### Returns

`HTMLCanvasElement`

#### Defined in

[WebCam.ts:56](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L56)

## Methods

### destroy

▸ **destroy**(): `void`

Stop camera streaming and remove view template

**`memberof`** WebCam

#### Returns

`void`

#### Defined in

[WebCam.ts:158](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L158)

___

### off

▸ **off**(`event`, `callback`): `void`

Remove event listener. Remove callback from array

**`memberof`** EventEmitter

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `callback` | `Function` |

#### Returns

`void`

#### Inherited from

[EventEmitter](EventEmitter.md).[off](EventEmitter.md#off)

#### Defined in

[EventEmitter.ts:27](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/EventEmitter.ts#L27)

___

### on

▸ **on**<`U`\>(`event`, `callback`): `void`

Add event listener. Push it to the events array and invoke by calling emit

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends keyof [`IWebCamEvents`](../interfaces/IWebCamEvents.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `U` |
| `callback` | [`IWebCamEvents`](../interfaces/IWebCamEvents.md)[`U`] |

#### Returns

`void`

#### Inherited from

[EventEmitter](EventEmitter.md).[on](EventEmitter.md#on)

#### Defined in

[WebCam.ts:12](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L12)

___

### onFrame

▸ **onFrame**(`canvasCtx`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `canvasCtx` | `CanvasRenderingContext2D` |

#### Returns

`void`

#### Defined in

[WebCam.ts:54](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L54)

___

### pause

▸ **pause**(): `void`

Pause camera streaming

**`memberof`** WebCam

#### Returns

`void`

#### Defined in

[WebCam.ts:130](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L130)

___

### resume

▸ **resume**(): `void`

Resume camera streaming

**`memberof`** WebCam

#### Returns

`void`

#### Defined in

[WebCam.ts:147](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/WebCam.ts#L147)
