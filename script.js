
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

let activeEffect = 'normal';
let pixelTimer = null;
let pixelCanvas = null;
let pixelContext = null;

rotateBtn.addEventListener('click', () => {
  viewer.autoRotate = !viewer.autoRotate;
  rotateBtn.textContent = viewer.autoRotate
    ? '⏸ Остановить вращение'
    : '▶ Включить вращение';
});

viewer.addEventListener('load', () => {
  const animations = viewer.availableAnimations || [];

  if (animations.length > 0) {
    viewer.animationName = animations.includes('Animation')
      ? 'Animation'
      : animations[0];
    viewer.play();
    animationBtn.disabled = false;
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

/* Пикселизация через низкое разрешение */
function startPixelate() {
  stopPixelate();

  pixelCanvas = document.createElement('canvas');
  pixelCanvas.className = 'pixel-overlay';
  pixelCanvas.setAttribute('aria-hidden', 'true');

  pixelContext = pixelCanvas.getContext('2d', {
    alpha: false
  });

  if (!pixelContext) return;

  viewerWrap.appendChild(pixelCanvas);

  function renderPixelFrame() {
    if (activeEffect !== 'pixel' || !pixelCanvas) return;

    const width = Math.max(1, viewer.clientWidth);
    const height = Math.max(1, viewer.clientHeight);

    const pixelSize = 12;

    const lowWidth = Math.max(1, Math.floor(width / pixelSize));
    const lowHeight = Math.max(1, Math.floor(height / pixelSize));

    if (pixelCanvas.width !== lowWidth ||
        pixelCanvas.height !== lowHeight) {
      pixelCanvas.width = lowWidth;
      pixelCanvas.height = lowHeight;
    }

    try {
      const image = viewer.toDataURL('image/png');
      const frame = new Image();

      frame.onload = () => {
        if (activeEffect !== 'pixel' || !pixelContext) return;

        pixelContext.imageSmoothingEnabled = false;
        pixelContext.clearRect(0, 0, lowWidth, lowHeight);
        pixelContext.drawImage(frame, 0, 0, lowWidth, lowHeight);
      };

      frame.src = image;
    } catch (error) {
      console.warn('Pixelate:', error);
    }
  }

  renderPixelFrame();
  pixelTimer = setInterval(renderPixelFrame, 250);
}

function stopPixelate() {
  if (pixelTimer !== null) {
    clearInterval(pixelTimer);
    pixelTimer = null;
  }

  if (pixelCanvas) {
    pixelCanvas.remove();
    pixelCanvas = null;
  }

  pixelContext = null;
}

function setEffect(effect) {
  stopPixelate();
  activeEffect = effect;

  viewerWrap.classList.remove('effect-pixel', 'effect-glitch');

  [normalEffect, pixelEffect, glitchEffect].forEach(button => {
    button.classList.remove('active');
  });

  effectStatus.hidden = true;

  if (effect === 'pixel') {
    pixelEffect.classList.add('active');
    viewerWrap.classList.add('effect-pixel');

    effectDescription.textContent =
      'Pixelate: изображение отображается с крупными квадратными пикселями.';

    effectStatus.textContent = 'PIXELATE';
    effectStatus.hidden = false;

    startPixelate();
  } else if (effect === 'glitch') {
    glitchEffect.classList.add('active');
    viewerWrap.classList.add('effect-glitch');

    effectDescription.textContent =
      'Glitch: цифровые искажения и цветовые смещения.';

    effectStatus.textContent = 'GLITCH';
    effectStatus.hidden = false;
  } else {
    normalEffect.classList.add('active');
    effectDescription.textContent =
      'Исходное изображение без дополнительных эффектов.';
  }
}

normalEffect.addEventListener('click', () => setEffect('normal'));
pixelEffect.addEventListener('click', () => setEffect('pixel'));
glitchEffect.addEventListener('click', () => setEffect('glitch'));
