---
id: "EventEmitter"
title: "Class: EventEmitter"
sidebar_label: "EventEmitter"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- **`EventEmitter`**

  ↳ [`WebCam`](WebCam.md)

  ↳ [`FaceCheckBridge`](FaceCheckBridge.md)

## Implements

- [`IEventEmitter`](../interfaces/IEventEmitter.md)

## Constructors

### constructor

• **new EventEmitter**()

## Methods

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

#### Implementation of

[IEventEmitter](../interfaces/IEventEmitter.md).[off](../interfaces/IEventEmitter.md#off)

#### Defined in

[EventEmitter.ts:27](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/EventEmitter.ts#L27)

___

### on

▸ **on**(`event`, `callback`): `void`

Add event listener. Push it to the events array and invoke by calling emit

**`memberof`** EventEmitter

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `callback` | `Function` |

#### Returns

`void`

#### Implementation of

[IEventEmitter](../interfaces/IEventEmitter.md).[on](../interfaces/IEventEmitter.md#on)

#### Defined in

[EventEmitter.ts:16](https://github.com/sergio-lucas/webCamProcessor/blob/13b69e2/src/library/EventEmitter.ts#L16)
