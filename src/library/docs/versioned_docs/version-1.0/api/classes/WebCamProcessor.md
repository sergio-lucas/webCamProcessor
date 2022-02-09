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

WebCamProcessor.ts:56

## Properties

### camView

• **camView**: `HTMLElement`

#### Defined in

WebCamProcessor.ts:43

___

### container

• **container**: `HTMLElement`

#### Defined in

WebCamProcessor.ts:42

___

### events

• **events**: `Map`<`any`, `any`\>

#### Inherited from

[EventEmitter](EventEmitter.md).[events](EventEmitter.md#events)

#### Defined in

EventEmitter.ts:7

___

### frameProcessor

• **frameProcessor**: [`FrameProcessor`](FrameProcessor.md)

#### Defined in

WebCamProcessor.ts:45

___

### outputCanvas

• **outputCanvas**: `HTMLCanvasElement`

#### Defined in

WebCamProcessor.ts:47

___

### outputCtx

• **outputCtx**: `any`

#### Defined in

WebCamProcessor.ts:48

___

### state

• **state**: `State`

#### Defined in

WebCamProcessor.ts:46

___

### stream

• **stream**: `MediaStream`

#### Defined in

WebCamProcessor.ts:49

___

### video

• **video**: `HTMLVideoElement`

#### Defined in

WebCamProcessor.ts:44

## Accessors

### camera\_preview

• `get` **camera_preview**(): `HTMLCanvasElement`

#### Returns

`HTMLCanvasElement`

#### Defined in

WebCamProcessor.ts:75

___

### mesh\_preview

• `get` **mesh_preview**(): `Element`

#### Returns

`Element`

#### Defined in

WebCamProcessor.ts:78

## Methods

### destroy

▸ **destroy**(): `void`

Stop camera streaming and remove view template

**`memberof`** WebCamProcessor

#### Returns

`void`

#### Defined in

WebCamProcessor.ts:181

___

### off

▸ **off**(`event`, `callback`): `void`

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

EventEmitter.ts:13

___

### on

▸ **on**<`U`\>(`event`, `callback`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends keyof [`IEvents`](../interfaces/IEvents.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `U` |
| `callback` | [`IEvents`](../interfaces/IEvents.md)[`U`] |

#### Returns

`void`

#### Inherited from

[EventEmitter](EventEmitter.md).[on](EventEmitter.md#on)

#### Defined in

WebCamProcessor.ts:24

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

WebCamProcessor.ts:122

___

### pause

▸ **pause**(): `void`

Pause camera streaming

**`memberof`** WebCamProcessor

#### Returns

`void`

#### Defined in

WebCamProcessor.ts:150

___

### resume

▸ **resume**(): `void`

Resume camera streaming

**`memberof`** WebCamProcessor

#### Returns

`void`

#### Defined in

WebCamProcessor.ts:170
