import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Controls {
  constructor(camera, rendererDomElement) {
    this.controls = new OrbitControls(camera, rendererDomElement);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
  }

  update() {
    this.controls.update();
  }
}