---
id: "index"
title: "WeCam"
slug: "/api/"
sidebar_label: "Overview"
sidebar_position: 0.5
custom_edit_url: null
---

## Enumerations

- [EventType](enums/EventType.md)

## Classes

- [EventEmitter](classes/EventEmitter.md)
- [FaceCheckBridge](classes/FaceCheckBridge.md)
- [WebCam](classes/WebCam.md)

## Interfaces

- [IEventEmitter](interfaces/IEventEmitter.md)
- [IWebCamEvents](interfaces/IWebCamEvents.md)

## Variables

### App

• **App**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `captureFrame` | () => `string` |
| `destroyDetector` | () => `void` |
| `loadDetector` | () => `void` |
| `mount` | (`domEl`: `HTMLElement`) => [`WebCam`](classes/WebCam.md) |
| `pauseDetector` | () => `void` |
| `resetAnchor` | () => `void` |
| `startDetector` | () => `void` |

#### Defined in

[FaceCheck.ts:46](https://github.com/sergio-lucas/webCamProcessor/blob/bb7bfcb/src/library/FaceCheck.ts#L46)
