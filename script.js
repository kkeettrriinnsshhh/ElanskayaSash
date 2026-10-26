
const viewer = document.querySelector('#viewer');

const rotateBtn = document.querySelector('#rotateBtn');
const zoomIn = document.querySelector('#zoomIn');
const zoomOut = document.querySelector('#zoomOut');
const resetBtn = document.querySelector('#resetBtn');

const initialOrbit = '0deg 75deg 10.16m';
const initialFov = '30deg';

rotateBtn.addEventListener('click', () => {
  viewer.autoRotate = !viewer.autoRotate;
  rotateBtn.textContent = viewer.autoRotate
    ? '⏸ Остановить вращение'
    : '▶ Включить вращение';
});

function changeZoom(factor) {
  const orbit = viewer.getCameraOrbit();
  const distance = Math.max(2, Math.min(30, orbit.radius * factor));
  viewer.cameraOrbit =
    `${orbit.theta}rad ${orbit.phi}rad ${distance}m`;
}

zoomIn.addEventListener('click', () => changeZoom(0.8));
zoomOut.addEventListener('click', () => changeZoom(1.25));

resetBtn.addEventListener('click', () => {
  viewer.cameraOrbit = initialOrbit;
  viewer.fieldOfView = initialFov;
  viewer.autoRotate = true;
  rotateBtn.textContent = '⏸ Остановить вращение';
  viewer.jumpCameraToGoal();
});
