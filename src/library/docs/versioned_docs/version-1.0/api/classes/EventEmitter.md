---
id: "EventEmitter"
title: "Class: EventEmitter"
sidebar_label: "EventEmitter"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- **`EventEmitter`**

  ↳ [`WebCamProcessor`](WebCamProcessor.md)

## Implements

- [`IEventEmitter`](../interfaces/IEventEmitter.md)

## Constructors

### constructor

• **new EventEmitter**()

## Properties

### events

• **events**: `Map`<`any`, `any`\>

#### Defined in

EventEmitter.ts:7

## Methods

### off

▸ **off**(`event`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `callback` | `Function` |

#### Returns

`void`

#### Defined in

EventEmitter.ts:13

___

### on

▸ **on**(`event`, `callback`): `void`

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

EventEmitter.ts:9
