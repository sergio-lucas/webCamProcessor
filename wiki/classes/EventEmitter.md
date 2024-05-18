[**libraries**](../README.md) • **Docs**

***

[libraries](../README.md) / EventEmitter

# Class: EventEmitter

## Implements

- [`IEventEmitter`](../interfaces/IEventEmitter.md)

## Constructors

### new EventEmitter()

> **new EventEmitter**(): [`EventEmitter`](EventEmitter.md)

#### Returns

[`EventEmitter`](EventEmitter.md)

## Properties

### events

> `private` **events**: `Map`\<`any`, `any`\>

#### Source

[EventEmitter.ts:10](https://github.com/sergio-lucas/webCamProcessor/blob/57d27e6de13fdba229232b2cc0b94b60cad68d31/src/library/EventEmitter.ts#L10)

## Methods

### emit()

> `protected` **emit**(`event`, `payload`?): `void`

#### Parameters

• **event**: `string`

• **payload?**: `EmitterPayload`

#### Returns

`void`

#### Source

[EventEmitter.ts:43](https://github.com/sergio-lucas/webCamProcessor/blob/57d27e6de13fdba229232b2cc0b94b60cad68d31/src/library/EventEmitter.ts#L43)

***

### off()

> **off**(`event`, `callback`): `void`

Remove event listener. Remove callback from array

#### Parameters

• **event**: `string`

• **callback**: `EmitterPayload`

#### Returns

`void`

#### Implementation of

[`IEventEmitter`](../interfaces/IEventEmitter.md).[`off`](../interfaces/IEventEmitter.md#off)

#### Memberof

EventEmitter

#### Source

[EventEmitter.ts:33](https://github.com/sergio-lucas/webCamProcessor/blob/57d27e6de13fdba229232b2cc0b94b60cad68d31/src/library/EventEmitter.ts#L33)

***

### on()

> **on**(`event`, `callback`): `void`

Add event listener. Push it to the events array and invoke by calling emit

#### Parameters

• **event**: `string`

• **callback**: `EmitterPayload`

#### Returns

`void`

#### Implementation of

[`IEventEmitter`](../interfaces/IEventEmitter.md).[`on`](../interfaces/IEventEmitter.md#on)

#### Memberof

EventEmitter

#### Source

[EventEmitter.ts:19](https://github.com/sergio-lucas/webCamProcessor/blob/57d27e6de13fdba229232b2cc0b94b60cad68d31/src/library/EventEmitter.ts#L19)
