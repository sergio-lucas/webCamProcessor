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

• **new WebCamProcessor**(`container`, `frameProcessor?`)

Creates an instance of WebCamProcessor.

**`memberof`** WebCamProcessor

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `HTMLElement` |
| `frameProcessor?` | `Function` |

#### Inherited from

[EventEmitter](EventEmitter.md).[constructor](EventEmitter.md#constructor)

#### Defined in

WebCamProcessor.ts:58

## Properties

### camView

• **camView**: `HTMLElement`

#### Defined in

WebCamProcessor.ts:45

___

### container

• **container**: `HTMLElement`

#### Defined in

WebCamProcessor.ts:44

___

### frameProcessor

• **frameProcessor**: [`FrameProcessor`](FrameProcessor.md)

#### Defined in

WebCamProcessor.ts:47

___

### outputCanvas

• **outputCanvas**: `HTMLCanvasElement`

#### Defined in

WebCamProcessor.ts:49

___

### outputCtx

• **outputCtx**: `any`

#### Defined in

WebCamProcessor.ts:50

___

### state

• **state**: `State`

#### Defined in

WebCamProcessor.ts:48

___

### stream

• **stream**: `MediaStream`

#### Defined in

WebCamProcessor.ts:51

___

### video

• **video**: `HTMLVideoElement`

#### Defined in

WebCamProcessor.ts:46

## Accessors

### camera\_preview

• `get` **camera_preview**(): `HTMLCanvasElement`

#### Returns

`HTMLCanvasElement`

#### Defined in

WebCamProcessor.ts:77

___

### mesh\_preview

• `get` **mesh_preview**(): `Element`

#### Returns

`Element`

#### Defined in

WebCamProcessor.ts:80

## Methods

### destroy

▸ **destroy**(): `void`

Stop camera streaming and remove view template

**`memberof`** WebCamProcessor

#### Returns

`void`

#### Defined in

WebCamProcessor.ts:191

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

EventEmitter.ts:27

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

WebCamProcessor.ts:26

___

### onProcess

▸ **onProcess**(`__namedParameters`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.errors` | `number`[] |
| `__namedParameters.isFaceExist` | `boolean` |
| `__namedParameters.ms` | `number` |
| `cb` | `Function` |

#### Returns

`void`

#### Defined in

WebCamProcessor.ts:132

___

### pause

▸ **pause**(): `void`

Pause camera streaming

**`memberof`** WebCamProcessor

#### Returns

`void`

#### Defined in

WebCamProcessor.ts:160

___

### resume

▸ **resume**(): `void`

Resume camera streaming

**`memberof`** WebCamProcessor

#### Returns

`void`

#### Defined in

WebCamProcessor.ts:180
