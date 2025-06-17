import * as THREE from 'three';

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
  }

  add(object) {
    this.scene.add(object);
  }

  getScene() {
    return this.scene;
  }
}