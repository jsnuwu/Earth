import * as THREE from 'three';

export class Planet {
  constructor(scene) {
    this.radius = 15;

    const texture = new THREE.TextureLoader().load('textures/earthmap.jpeg');
    const bumpMap = new THREE.TextureLoader().load('textures/earthbump.jpeg');
    const cloudsTexture = new THREE.TextureLoader().load('textures/earthCloud.png');

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      bumpMap: bumpMap,
      bumpScale: 0.01,
    });

    const geometry = new THREE.SphereGeometry(this.radius, 64, 32);
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene = scene;
    this.scene.add(this.mesh);

    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });

    const cloudsGeometry = new THREE.SphereGeometry(this.radius * 1.01, 64, 32);
    this.cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    this.scene.add(this.cloudsMesh);
  }

  rotate(speed = 0.0005) {
    this.mesh.rotation.y += speed;
    this.cloudsMesh.rotation.y += speed * 1.2;
  }

  getMesh() {
    return this.mesh;
  }
}
