
const viewer = document.querySelector('#viewer');
const viewerWrap = document.querySelector('#viewerWrap');

const rotateBtn = document.querySelector('#rotateBtn');
const animationBtn = document.querySelector('#animationBtn');
const zoomIn = document.querySelector('#zoomIn');
const zoomOut = document.querySelector('#zoomOut');
const resetBtn = document.querySelector('#resetBtn');

const normalEffect = document.querySelector('#normalEffect');
const pixelEffect = document.querySelector('#pixelEffect');
const glitchEffect = document.querySelector('#glitchEffect');

const effectDescription = document.querySelector('#effectDescription');
const effectStatus = document.querySelector('#effectStatus');

const initialOrbit = '0deg 75deg 10.16m';
const initialFov = '30deg';

/* Вращение модели */
rotateBtn.addEventListener('click', () => {
  viewer.autoRotate = !viewer.autoRotate;

  rotateBtn.textContent = viewer.autoRotate
    ? '⏸ Остановить вращение'
    : '▶ Включить вращение';
});

/* Воспроизведение анимации */
viewer.addEventListener('load', () => {
  const animations = viewer.availableAnimations || [];

  if (animations.length > 0) {
    viewer.animationName = animations.includes('Animation')
      ? 'Animation'
      : animations[0];

    viewer.play();
    animationBtn.disabled = false;
    animationBtn.textContent = '⏸ Остановить анимацию';
  } else {
    animationBtn.disabled = true;
    animationBtn.textContent = 'Анимация отсутствует';
  }
});

animationBtn.addEventListener('click', () => {
  if (viewer.paused) {
    viewer.play();
    animationBtn.textContent = '⏸ Остановить анимацию';
  } else {
    viewer.pause();
    animationBtn.textContent = '▶ Запустить анимацию';
  }
});

/* Масштабирование */
function changeZoom(factor) {
  const orbit = viewer.getCameraOrbit();

  const distance = Math.max(
    2,
    Math.min(30, orbit.radius * factor)
  );

  viewer.cameraOrbit =
    `${orbit.theta}rad ${orbit.phi}rad ${distance}m`;
}

zoomIn.addEventListener('click', () => changeZoom(0.8));
zoomOut.addEventListener('click', () => changeZoom(1.25));

/* Сброс камеры */
resetBtn.addEventListener('click', () => {
  viewer.cameraOrbit = initialOrbit;
  viewer.fieldOfView = initialFov;
  viewer.autoRotate = true;

  rotateBtn.textContent = '⏸ Остановить вращение';

  viewer.jumpCameraToGoal();
});

/* Визуальные эффекты */
const effectButtons = [
  normalEffect,
  pixelEffect,
  glitchEffect
];

function setEffect(effect) {
  viewerWrap.classList.remove(
    'effect-pixel',
    'effect-glitch'
  );

  effectButtons.forEach(button => {
    button.classList.remove('active');
  });

  effectStatus.hidden = true;

  if (effect === 'pixel') {
    viewerWrap.classList.add('effect-pixel');
    pixelEffect.classList.add('active');

    effectDescription.textContent =
      'Pixelate: стилизация изображения с повышенным контрастом и насыщенностью.';

    effectStatus.textContent = 'PIXELATE';
    effectStatus.hidden = false;
  }

  else if (effect === 'glitch') {
    viewerWrap.classList.add('effect-glitch');
    glitchEffect.classList.add('active');

    effectDescription.textContent =
      'Glitch: цифровые искажения, цветовые смещения и эффект дрожания изображения.';

    effectStatus.textContent = 'GLITCH';
    effectStatus.hidden = false;
  }

  else {
    normalEffect.classList.add('active');

    effectDescription.textContent =
      'Исходное изображение без дополнительных эффектов.';
  }
}

normalEffect.addEventListener('click', () => setEffect('normal'));
pixelEffect.addEventListener('click', () => setEffect('pixel'));
glitchEffect.addEventListener('click', () => setEffect('glitch'));
