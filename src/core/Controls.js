import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Controls {
  constructor(camera, rendererDomElement) {
    this.controls = new OrbitControls(camera, rendererDomElement);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;

    this.controls.minDistance = 16;
    this.controls.maxDistance= 1000;
  }

  update() {
    this.controls.update();
  }
}