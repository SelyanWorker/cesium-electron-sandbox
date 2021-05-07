let viewer = new Cesium.Viewer("cesiumContainer", {
  //sceneMode : Cesium.SceneMode.SCENE2D,
  timeline : false,
  homeButton : false,
  geocoder : false,
  fullscreenButton : false, 
  baseLayerPicker : false,
  animation : false,
  navigationHelpButton : false,
  navigationInstructionsInitiallyVisible : false,
  infoBox : false,
  sceneModePicker : false,
  selectionIndicator : false
});

viewer._cesiumWidget._creditContainer.parentNode.removeChild(
    viewer._cesiumWidget._creditContainer);

let camera = viewer.camera;
let camCartPos = camera.positionCartographic;
camCartPos.height = 1000000;
camera.setView({
  destination: Cesium.Cartographic.toCartesian(camCartPos)
});

/*const TelemetryReceiver = require('./../../telemetry_receiver/telemetry-receiver')
let tr = new TelemetryReceiver()
tr.setPositionCallback((position) =>
{
  let cartogrPos = new Cesium.Cartographic(position.longitude, position.latitude, position.height)
  camera.setView({
    direction: Cesium.Cartographic.toCartesian(cartogrPos)
  });
})
tr.setOrientationCallback((orientation) =>
{
  camera.setView({
    orientation: orientation
  });
})*/

const { ipcRenderer } = require('electron');

ipcRenderer.on('updatePosition', (event, arg) =>
{
  let cartPos = new Cesium.Cartographic(arg.longitude, arg.latitude, arg.height)
  console.log(cartPos)
  camera.setView({
    destination: Cesium.Cartographic.toCartesian(cartPos),
    orientation:
    {
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll
    }
  });
});

ipcRenderer.on('updateOrientation', (event, arg) =>
{
  camera.setView({
    destination: camera.position,
    orientation: arg
  });
});