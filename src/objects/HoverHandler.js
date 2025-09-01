import * as THREE from "three";

export class HoverHandler {
  constructor(camera, domElement, objects) {
    this.camera = camera;
    this.domElement = domElement;
    this.objects = objects;

    this.raycaster = new THREE.Raycaster();
    this.raycaster.near = 0;
    this.raycaster.far = 1000;
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

        if (this.hovered.userData.originalScale) {
          this.hovered.scale.copy(this.hovered.userData.originalScale);
        } else {
          this.hovered.scale.set(1, 1, 1);
        }
        this.hovered = null;
      }
      return;
    }

    const obj = intersects[0].object;

    if (
      !obj.userData.source ||
      !obj.userData.source.includes("bundeslaender.geo.json")
    ) {
      if (this.hovered) {
        this._resetHover(this.hovered);
        this.hovered = null;
      }
      return;
    }
    if (this.hovered !== obj) {
      if (this.hovered) {
        this.hovered.material.color.copy(this.hovered.userData.originalColor);
        if (this.hovered.userData.originalScale) {
          this.hovered.scale.copy(this.hovered.userData.originalScale);
        } else {
          this.hovered.scale.set(0.3, 0.3, 0.3);
        }
      }

      obj.material.color.set(0x00008b);

      if (!obj.userData.originalScale) {
        obj.userData.originalScale = obj.scale.clone();
      }

      obj.scale.set(1.008, 1.008, 1.008);

      this.hovered = obj;
    }
  }
  _resetHover(obj) {
    obj.material.color.copy(obj.userData.originalColor);
    if (obj.userData.originalScale) {
      obj.scale.copy(obj.userData.originalScale);
    } else {
      obj.scale.set(1, 1, 1);
    }
  }
}
