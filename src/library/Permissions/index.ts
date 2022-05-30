// import html from "./Permissions.html";
var template = require('./Permissions.html');
import { Template } from '../Template/Template';

var view = {
  text: "Joe",
  action: function () {
    return () => "App.camera.requestAccess()"
  }
};
const Views = {
  permissions: () => template(view)
}

export { Views };

