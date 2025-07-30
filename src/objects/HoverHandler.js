import * as THREE from "three";

export class HoverHandler {
  constructor(camera, domElement, objects) {
    this.camera = camera;
    this.domElement = domElement;
    this.objects = objects;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Line.threshold = 0.1;
    this.mouse = new THREE.Vector2();
    this.hovered = null;
  }

  handle(event) {
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera.getCamera());

    const intersects = this.raycaster.intersectObjects(this.objects, true);

    if (intersects.length === 0) {
      if (this.hovered) {
        this.hovered.material.color.copy(this.hovered.userData.originalColor);
        this.hovered = null;
      }
      return;
    }

    const obj = intersects[0].object;

    if (this.hovered !== obj) {
      if (this.hovered) {
        this.hovered.material.color.copy(this.hovered.userData.originalColor);
      }

      obj.material.color.set(0xff0000);
      this.hovered = obj;
    }
  }
}
