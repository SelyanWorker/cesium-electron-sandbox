var viewer = new Cesium.Viewer("cesiumContainer", {
  //sceneMode : Cesium.SceneMode.SCENE2D,
  infoBox: false, //Disable InfoBox widget
  selectionIndicator: false, //Disable selection indicator
  shouldAnimate: true, // Enable animations
  terrainProvider: Cesium.createWorldTerrain(),
  timeline : false,
  homeButton : false,
  geocoder : false,
  fullscreenButton : false, 
  baseLayerPicker : false,
  animation : false,
  navigationHelpButton : false,
  navigationInstructionsInitiallyVisible : false,
  sceneModePicker : false
});

viewer._cesiumWidget._creditContainer.parentNode.removeChild(
    viewer._cesiumWidget._creditContainer);
	
//Enable lighting based on the sun position
viewer.scene.globe.enableLighting = true;

//Enable depth testing so things behind the terrain disappear.
viewer.scene.globe.depthTestAgainstTerrain = true;

//Set the random number seed for consistent results.
Cesium.Math.setRandomNumberSeed(3);

//Set bounds of our simulation time
var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
var stop = Cesium.JulianDate.addSeconds(
  start,
  360,
  new Cesium.JulianDate()
);

//Make sure viewer is at the desired time.
viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
viewer.clock.multiplier = 10;

//Set timeline to simulation bounds
//viewer.timeline.zoomTo(start, stop);

//Generate a random circular pattern with varying heights.
function computeCirclularFlight(lon, lat, radius) {
  var property = new Cesium.SampledPositionProperty();
  for (var i = 0; i <= 360; i += 45) {
    var radians = Cesium.Math.toRadians(i);
    var time = Cesium.JulianDate.addSeconds(
      start,
      i,
      new Cesium.JulianDate()
    );
    var position = Cesium.Cartesian3.fromDegrees(
      lon + radius * 1.5 * Math.cos(radians),
      lat + radius * Math.sin(radians),
      Cesium.Math.nextRandomNumber() * 500 + 1750
    );
    property.addSample(time, position);

    //Also create a point for each sample we generate.
    viewer.entities.add({
      position: position,
      point: {
        pixelSize: 8,
        color: Cesium.Color.TRANSPARENT,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 3,
      },
    });
  }
  return property;
}

//Compute the entity position property.
var position = computeCirclularFlight(-112.110693, 36.0994841, 0.03);

//Actually create the entity
var entity = viewer.entities.add({
  //Set the entity availability to the same interval as the simulation time.
  availability: new Cesium.TimeIntervalCollection([
    new Cesium.TimeInterval({
      start: start,
      stop: stop,
    }),
  ]),

  //Use our computed positions
  position: position,

  
  //Automatically compute orientation based on position movement.
  orientation: new Cesium.VelocityOrientationProperty(position),

  //Load the Cesium plane model to represent the entity
  model: {
    uri: "Cesium_Air.glb",
    minimumPixelSize: 64,
  },

  //Show the path as a pink line sampled in 1 second increments.
  path: {
    resolution: 1,
    material: new Cesium.PolylineGlowMaterialProperty({
      glowPower: 0.1,
      color: Cesium.Color.YELLOW,
    }),
    width: 10,
  },
});

entity.position.setInterpolationOptions({
          interpolationDegree: 5,
          interpolationAlgorithm:
            Cesium.LagrangePolynomialApproximation,
        });
		
viewer.trackedEntity = entity;

