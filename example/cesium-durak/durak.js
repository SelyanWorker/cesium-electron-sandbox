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

var durakModel = new Cesium.ModelGraphics({
	uri: "durak.glb",
	minimumPixelSize: 64,
	maximumScale: 2000000
});

function createEntity(id, model, lon, lat, height, heading, pitch, roll) 
{
  let entity = viewer.entities.add({
    id: id,
    model: model
  });
  
  setPositionEntity(entity, lon, lat, height);
  setOrientationEntity(entity, heading, pitch, roll);
  
  viewer.trackedEntity = entity;
  return entity;
}

function setPositionEntity(entity, longitude, latitude, height)
{
	entity.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
}

function setOrientationEntity(entity, heading, pitch, roll)
{
	heading = Cesium.Math.toRadians(heading);
	pitch = Cesium.Math.toRadians(pitch);
	roll = Cesium.Math.toRadians(roll);
	let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
	
	let orientation = Cesium.Transforms.headingPitchRollQuaternion(
		entity.position.getValue({}),
		hpr
	);
		
	entity.orientation = orientation;
}

function moveEntity(entity, lonInc, latInc)
{
  let oldPos = entity.position.getValue({});
  
  let cartographic = Cesium.Cartographic.fromCartesian(oldPos);
  let lon = Cesium.Math.toDegrees(cartographic.longitude) + lonInc; 
  let lat = Cesium.Math.toDegrees(cartographic.latitude) + latInc;   
      
  setPositionEntity(entity, lon, lat);
}

function moveDurak(durak)
{
	moveEntity(durak, 0, -0.001);
}

const border = 15;
var step = 1;
var currentRoll = 0;
function rotateDurak(durak)
{
	if (currentRoll >= border || 
		currentRoll <= -border)
	{
		step *= -1;
	}
	
	currentRoll += step;
	
	setOrientationEntity(durak, 90, 0, currentRoll);
}

function durakAction(durak)
{
	moveDurak(durak);
	rotateDurak(durak);
}

let duraki = [];
duraki.push(createEntity("durak_" + 0 + "_" + 0, durakModel, 0, 0, 0, 90, 0, 0));
/*for(let i = -90; i <= 90; i += 10)
{
	for(let j = -180; j <= 180; j += 10)
	{
		duraki.push(createEntity("durak_" + i + "_" + j, durakModel, i, j, 0, 90, 0, 0));
	}
}*/

setInterval(function()
{
	duraki.forEach(d => durakAction(d));
}, 10)


/*const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
	console.log(fps);
    refreshLoop();
  });
}

refreshLoop();*/