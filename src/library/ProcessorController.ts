export abstract class Processor {
  abstract load(cb: Function): void;
}

export class ProcessorController extends Processor {
  processor: any;
  constructor(processor: Processor) {
    super();
    this.processor = processor;

    this.load()
  }

  load() {
    this.processor.load();
  }

  start() {
    this.processor.start();
  }
  stop() {
    this.processor.stop();
  }
}