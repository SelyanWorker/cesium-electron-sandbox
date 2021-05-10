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