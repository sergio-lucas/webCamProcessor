---
id: "FaceCheckBridge"
title: "Class: FaceCheckBridge"
sidebar_label: "FaceCheckBridge"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- [`EventEmitter`](EventEmitter.md)

  ↳ **`FaceCheckBridge`**

## Constructors

### constructor

• **new FaceCheckBridge**(`url`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` \| `URL` |

#### Inherited from

[EventEmitter](EventEmitter.md).[constructor](EventEmitter.md#constructor)

#### Defined in

[FaceCheckBridge.ts:31](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/FaceCheckBridge.ts#L31)

## Properties

### worker

• **worker**: `Worker`

#### Defined in

[FaceCheckBridge.ts:30](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/FaceCheckBridge.ts#L30)

## Methods

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Defined in

[FaceCheckBridge.ts:54](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/FaceCheckBridge.ts#L54)

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
| `U` | extends keyof `IFaceCheckEvents` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `U` |
| `callback` | `IFaceCheckEvents`[`U`] |

#### Returns

`void`

#### Inherited from

[EventEmitter](EventEmitter.md).[on](EventEmitter.md#on)

#### Defined in

[FaceCheckBridge.ts:26](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/FaceCheckBridge.ts#L26)

___

### onmessageReceive

▸ **onmessageReceive**(`ev`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ev` | `MessageEvent`<`any`\> |

#### Returns

`void`

#### Defined in

[FaceCheckBridge.ts:37](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/FaceCheckBridge.ts#L37)

___

### preloadFaceCheck

▸ **preloadFaceCheck**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`void`

#### Defined in

[FaceCheckBridge.ts:42](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/FaceCheckBridge.ts#L42)

___

### process\_frame

▸ **process_frame**(`data`, `transfer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Object` |
| `data.originImage` | `ImageData` |
| `transfer` | `Transferable`[] |

#### Returns

`void`

#### Defined in

[FaceCheckBridge.ts:46](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/FaceCheckBridge.ts#L46)

___

### resetAnchor

▸ **resetAnchor**(): `void`

#### Returns

`void`

#### Defined in

[FaceCheckBridge.ts:50](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/FaceCheckBridge.ts#L50)
