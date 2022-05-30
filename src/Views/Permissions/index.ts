// import html from "./Permissions.html";
var template = require('./Permissions.html');

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

