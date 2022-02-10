---
id: "FrameProcessor"
title: "Class: FrameProcessor"
sidebar_label: "FrameProcessor"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- [`Processor`](Processor.md)

  ↳ **`FrameProcessor`**

## Constructors

### constructor

• **new FrameProcessor**(`webCamProcessor`, `handleProcess`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `webCamProcessor` | [`WebCamProcessor`](WebCamProcessor.md) |
| `handleProcess` | `Function` |

#### Overrides

[Processor](Processor.md).[constructor](Processor.md#constructor)

#### Defined in

FrameProcessor.ts:7

## Properties

### handleProcess

• **handleProcess**: `Function`

#### Defined in

FrameProcessor.ts:5

___

### webCamProcessor

• **webCamProcessor**: [`WebCamProcessor`](WebCamProcessor.md)

#### Defined in

FrameProcessor.ts:6

## Methods

### getErrors

▸ **getErrors**(): `void`

#### Returns

`void`

#### Defined in

FrameProcessor.ts:36

___

### load

▸ **load**(`onLoad`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onLoad` | `Function` |

#### Returns

`void`

#### Overrides

[Processor](Processor.md).[load](Processor.md#load)

#### Defined in

FrameProcessor.ts:15

___

### loadDeps

▸ **loadDeps**(`onReady`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `onReady` | `Function` |

#### Returns

`Promise`<`void`\>

#### Defined in

FrameProcessor.ts:23

___

### onProgress

▸ **onProgress**(`progress`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `progress` | `any` |

#### Returns

`void`

#### Defined in

FrameProcessor.ts:19

___

### process

▸ **process**(`ms`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ms` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

FrameProcessor.ts:45
