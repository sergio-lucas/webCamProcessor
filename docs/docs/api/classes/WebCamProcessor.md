---
id: "WebCamProcessor"
title: "Class: WebCamProcessor"
sidebar_label: "WebCamProcessor"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- [`EventEmitter`](EventEmitter.md)

  ↳ **`WebCamProcessor`**

## Constructors

### constructor

• **new WebCamProcessor**(`container`)

Creates an instance of WebCamProcessor.

**`memberof`** WebCamProcessor

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `HTMLElement` |

#### Inherited from

[EventEmitter](EventEmitter.md).[constructor](EventEmitter.md#constructor)

#### Defined in

[library/WebCamProcessor.ts:48](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L48)

## Properties

### camView

• **camView**: `HTMLElement`

#### Defined in

[library/WebCamProcessor.ts:35](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L35)

___

### container

• **container**: `HTMLElement`

#### Defined in

[library/WebCamProcessor.ts:34](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L34)

___

### detectorHandler

• **detectorHandler**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[library/WebCamProcessor.ts:42](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L42)

___

### outputCanvas

• **outputCanvas**: `HTMLCanvasElement`

#### Defined in

[library/WebCamProcessor.ts:38](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L38)

___

### outputCtx

• **outputCtx**: `any`

#### Defined in

[library/WebCamProcessor.ts:39](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L39)

___

### state

• **state**: `State`

#### Defined in

[library/WebCamProcessor.ts:37](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L37)

___

### stream

• **stream**: `MediaStream`

#### Defined in

[library/WebCamProcessor.ts:40](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L40)

___

### video

• **video**: `HTMLVideoElement`

#### Defined in

[library/WebCamProcessor.ts:36](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L36)

## Accessors

### camera\_preview

• `get` **camera_preview**(): `HTMLCanvasElement`

#### Returns

`HTMLCanvasElement`

#### Defined in

[library/WebCamProcessor.ts:74](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L74)

## Methods

### destroy

▸ **destroy**(): `void`

Stop camera streaming and remove view template

**`memberof`** WebCamProcessor

#### Returns

`void`

#### Defined in

[library/WebCamProcessor.ts:176](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L176)

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

[library/EventEmitter.ts:27](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/EventEmitter.ts#L27)

___

### on

▸ **on**<`U`\>(`event`, `callback`): `void`

Add event listener. Push it to the events array and invoke by calling emit

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends keyof [`IWebCamProcessorEvents`](../interfaces/IWebCamProcessorEvents.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `U` |
| `callback` | [`IWebCamProcessorEvents`](../interfaces/IWebCamProcessorEvents.md)[`U`] |

#### Returns

`void`

#### Inherited from

[EventEmitter](EventEmitter.md).[on](EventEmitter.md#on)

#### Defined in

[library/WebCamProcessor.ts:13](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L13)

___

### onFaceDetect

▸ **onFaceDetect**(): `void`

#### Returns

`void`

#### Defined in

[library/WebCamProcessor.ts:66](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L66)

___

### pause

▸ **pause**(): `void`

Pause camera streaming

**`memberof`** WebCamProcessor

#### Returns

`void`

#### Defined in

[library/WebCamProcessor.ts:148](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L148)

___

### resume

▸ **resume**(): `void`

Resume camera streaming

**`memberof`** WebCamProcessor

#### Returns

`void`

#### Defined in

[library/WebCamProcessor.ts:165](https://github.com/sergio-lucas/webCamProcessor/blob/e78be59/src/library/WebCamProcessor.ts#L165)
