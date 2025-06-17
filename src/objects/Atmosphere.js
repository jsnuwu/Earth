import * as THREE from 'three';

export class Atmosphere {
  constructor() {
    const geometry = new THREE.SphereGeometry(15.5, 64, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.2,
    });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  rotate(speed = 0.002) {
    this.mesh.rotation.y += speed;
  }

  getMesh() {
    return this.mesh;
  }
}