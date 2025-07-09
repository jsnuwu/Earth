import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Controls {
  constructor(camera, rendererDomElement) {
    this.controls = new OrbitControls(camera, rendererDomElement);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;

    this.controls.minDistance = 16;
    this.controls.maxDistance= 1000;
    this.controls.enabled = true;
  }

  enable() {
    this.controls.enabled = true;
  }

  disable() {
    this.controls.enabled = false;
  }

  update() {
    this.controls.update();
  }
}