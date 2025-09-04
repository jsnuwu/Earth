import * as THREE from "three";

export class HoverHandler {
  constructor(camera, domElement, objects) {
    this.camera = camera;
    this.domElement = domElement;
    this.objects = objects;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.hovered = null;     // gerade gehovertes Objekt
    this.selected = null;    // fixiertes Objekt

    this._addClickListener();
  }

  handle(event) {
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera.getCamera());
    const intersects = this.raycaster.intersectObjects(this.objects, true);

    if (intersects.length === 0) {
      if (this.hovered && this.hovered !== this.selected) {
        this._resetHover(this.hovered);
      }
      this.hovered = null;
      return;
    }

    const obj = intersects[0].object;

    if (!obj.userData.source || !obj.userData.source.includes("bundeslaender.geo.json")) {
      if (this.hovered && this.hovered !== this.selected) {
        this._resetHover(this.hovered);
      }
      this.hovered = null;
      return;
    }

    if (this.hovered !== obj && obj !== this.selected) {
      if (this.hovered && this.hovered !== this.selected) {
        this._resetHover(this.hovered);
      }

      this._highlight(obj, 0x00008b, 1.009);
      this.hovered = obj;
    }
  }

  _addClickListener() {
    this.domElement.addEventListener("click", (event) => {
      const rect = this.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera.getCamera());
      const intersects = this.raycaster.intersectObjects(this.objects, true);

      if (intersects.length > 0) {
        const obj = intersects[0].object;

        if (obj.userData.source && obj.userData.source.includes("bundeslaender.geo.json")) {
          if (this.selected && this.selected !== obj) {
            this._resetHover(this.selected);
          }

          this._highlight(obj, 0x00008b, 1.010); 
          this.selected = obj;
          return;
        }
      }

      if (this.selected) {
        this._resetHover(this.selected);
        this.selected = null;
      }
    });
  }

  _highlight(obj, color, scaleFactor) {
    if (!obj.userData.originalColor) {
      obj.userData.originalColor = obj.material.color.clone();
    }
    if (!obj.userData.originalScale) {
      obj.userData.originalScale = obj.scale.clone();
    }

    obj.material.color.set(color);
    obj.scale.set(
      obj.userData.originalScale.x * scaleFactor,
      obj.userData.originalScale.y * scaleFactor,
      obj.userData.originalScale.z * scaleFactor
    );
  }

  _resetHover(obj) {
    if (!obj) return;
    if (obj.userData.originalColor) {
      obj.material.color.copy(obj.userData.originalColor);
    }
    if (obj.userData.originalScale) {
      obj.scale.copy(obj.userData.originalScale);
    }
  }
}
