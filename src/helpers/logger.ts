// import c from 'template-colors-web';

// c.define('log', ['rgb(0,0,0)', 'rgbBG(255,255,255)', 'bold', 'underline', 'italic']);


abstract class Logger {
  platform = "CTT";
  abstract tag: string;
  abstract color: string;
  getMessage() {
    return `${this.platform}-${this.tag }: `;
  }
}
// console.warn(c`example ${'warning'}.red.bold.underline
class LoggerInfo extends Logger {
  color = "orange";
  tag = "|INFO|";
  log(message: string):void {
    const logMessage = this.getMessage() + message;
    console.log(logMessage);
  }
}


class LoggerError extends Logger {
  color = "red";
  tag = "|ERROR|";
  log(message: string):void {
    const logMessage = this.getMessage() + message;
    console.log(logMessage);
  }
}

class LoggerHelper {
  public infoLogger: LoggerInfo;
  constructor() {
    this.infoLogger = new LoggerInfo();
  }
  log(message: string):void {
    this.infoLogger.log(message);
  }
}

const lg = new LoggerInfo();
lg.color

export default { LoggerHelper };

/*
logger.log("CT|LOG| sosals,dla,sd") - для лога. включяется в режиме дебага (в проде выключаются)
logger.error("CT|ERROR| sosals,dla,sd") - для отлова ошибок в режиме прода
logger.action("CT|ACTION|" ) - log resp action. записывать поведения респа в реал тайме ка для дебага так и прода

log middleware action
log sync action
log add context action
*/