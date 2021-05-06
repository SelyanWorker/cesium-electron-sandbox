var viewer = new Cesium.Viewer("cesiumContainer", {
  sceneMode : Cesium.SceneMode.SCENE2D,
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
