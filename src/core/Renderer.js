import * as THREE from 'three';

export class Renderer {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

  this.renderer.domElement.style.position = 'absolute';
  this.renderer.domElement.style.top = '0';
  this.renderer.domElement.style.left = '0';
  this.renderer.domElement.style.width = '100%';
  this.renderer.domElement.style.height = '100%';

    document.body.appendChild(this.renderer.domElement);
  }

  getRenderer() {
    return this.renderer;
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}