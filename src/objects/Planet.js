import * as THREE from 'three';

export class Planet {
  constructor(scene) {
    this.radius = 15;
    this.scene = scene;

    this.dayTexture = new THREE.TextureLoader().load('textures/earthmap.jpeg');
    this.nightTexture = new THREE.TextureLoader().load('textures/earthmap_night.jpeg');
    const bumpMap = new THREE.TextureLoader().load('textures/earthbump.jpeg');
    const cloudsTexture = new THREE.TextureLoader().load('textures/earthCloud.png');

    this.material = new THREE.MeshStandardMaterial({
      map: this.dayTexture,
      bumpMap: bumpMap,
      bumpScale: 0.01,
    });

    const geometry = new THREE.SphereGeometry(this.radius, 64, 32);
    this.mesh = new THREE.Mesh(geometry, this.material);
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

    this.isNight = false; 
  }

  rotate(speed = 0.0005) {
    this.mesh.rotation.y += speed;
    this.cloudsMesh.rotation.y += speed * 1.2;
  }

  toggleTexture() {
    this.isNight = !this.isNight;
    this.material.map = this.isNight ? this.nightTexture : this.dayTexture;
    this.material.needsUpdate = true;
  }

  getMesh() {
    return this.mesh;
  }
}
