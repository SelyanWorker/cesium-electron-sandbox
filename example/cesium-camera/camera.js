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

let camUpdate = true

let camPositions = []
let camOrientations = []
viewer.clock.onTick.addEventListener(function (clock)
{
  if (!camUpdate)
    return

  if (camPositions.length === 0 &&
      camOrientations.length === 0)
    return

  console.log("Cam pos: ", Cesium.Cartographic.fromCartesian(camera.position),
      " or: ", { heading: camera.heading, roll: camera.roll, pitch: camera.pitch })

  let newCamPos = camPositions.pop()
  if (!newCamPos)
    newCamPos = camera.position

  let newCamOr = camOrientations.pop()
  if (!newCamOr)
    newCamOr = { heading: camera.heading, roll: camera.roll, pitch: camera.pitch }

  camera.setView(
  {
    destination: newCamPos,
    orientation: newCamOr
  });
});

const { ipcRenderer } = require('electron');
ipcRenderer.on('updatePosition', (event, arg) =>
{
  camUpdate = false

  const stepCount = 10.0
  const step = 1.0 / stepCount


  let start = camPositions[camPositions.length - 1]
  if (!start)
    start = camera.position

  let end = Cesium.Cartographic.toCartesian(new Cesium.Cartographic(arg.longitude, arg.latitude, arg.height))

  for(let t = step; t <= 1.0 && stepCount > camPositions.length; t += step)
  {
    let interpolate = end
    Cesium.Cartesian3.lerp(start, end, t, interpolate)
    camPositions.push(interpolate)
  }

  console.log(camPositions.length)

  camUpdate = true
  //camPositions.push(Cesium.Cartographic.toCartesian(new Cesium.Cartographic(arg.longitude, arg.latitude, arg.height)))
  /*camera.setView({
    destination: Cesium.Cartographic.toCartesian(new Cesium.Cartographic(arg.longitude, arg.latitude, arg.height)),
    orientation:
    {
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll
    }
  });*/
});

ipcRenderer.on('updateOrientation', (event, orientation) =>
{
  /*if (!this.prevTime)
    this.prevTime = new Date().getTime()

  let curTime = new Date().getTime()
  let delay = curTime - this.prevTime
  this.prevTime = curTime

  console.log(delay)

  let lastCamOr = camOrientations[camOrientations.length - 1]
  if (!lastCamOr)
    lastCamOr = {heading: camera.heading, roll: camera.roll, pitch: camera.pitch}
  let startQuat = Cesium.Quaternion.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(lastCamOr.heading, lastCamOr.pitch, lastCamOr.roll))
  let endQuat = Cesium.Quaternion.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(orientation.heading, orientation.pitch, orientation.roll))

  const stepCount = 3.0
  const step = 1.0 / stepCount
  for(let t = step; t <= 1.0; t += step)
  {
    let interpolQuat = new Cesium.Quaternion()
    Cesium.Quaternion.lerp(startQuat, endQuat, t, interpolQuat)

    let hpr = Cesium.HeadingPitchRoll.fromQuaternion(interpolQuat)
    camOrientations.push({ heading: hpr.heading, pitch: hpr.pitch, roll: hpr.roll })
  }*/
  let radOrientation = { heading: Cesium.Math.toRadians(orientation.heading),
                         pitch: Cesium.Math.toRadians(orientation.pitch),
                         roll: Cesium.Math.toRadians(orientation.roll) }
  camOrientations.push(radOrientation)

  /*camera.setView({
    destination: camera.position,
    orientation: orientation
  });*/
});