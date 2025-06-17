import * as THREE from 'three';

export class Planet {
  constructor() {
    const geometry = new THREE.SphereGeometry(15, 64, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x2266ff });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  rotate(speed = 0.002) {
    this.mesh.rotation.y += speed;
    this.mesh.rotation.x += 0.001;
  }

  getMesh() {
    return this.mesh;
  }
}