// import c from 'template-colors-web';

// c.define('log', ['rgb(0,0,0)', 'rgbBG(255,255,255)', 'bold', 'underline', 'italic']);


abstract class Logger {
  private platform = "|CT|";
  abstract tag: string;
  abstract color: string;
  public getMessage() {
    return `${this.platform}  ${this.tag } `;
  }
}
// console.warn(c`example ${'warning'}.red.bold.underline
class LoggerInfo extends Logger {
  color: "orange";
  tag = "|INFO|";
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

export default { LoggerHelper };