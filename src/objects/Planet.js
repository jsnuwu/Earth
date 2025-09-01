import * as THREE from "three";
import { GeoJSONLoader } from "./GeoJSONLoader";
import { HoverHandler } from "./HoverHandler";

export class Planet {
  constructor(scene, rendererDomElement, camera) {
    this.radius = 15;
    this.scene = scene;
    this.domElement = rendererDomElement;
    this.camera = camera;

    const geometry = new THREE.SphereGeometry(this.radius, 64, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x2266dd,
      flatShading: false,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.bundeslandMeshes = [];

    const loader = new GeoJSONLoader(
      this.radius,
      this.mesh,
      this.bundeslandMeshes
    );
    loader.load("data/custom.geo.json");
    loader.load("data/bundeslaender.geo.json");

    this.hoverHandler = new HoverHandler(
      this.camera,
      this.domElement,
      this.bundeslandMeshes
    );
  }

  rotate(speed = 0.0005) {
    this.mesh.rotation.y -= speed;
  }

  getMesh() {
    return this.mesh;
  }

  onMouseMove(event) {
    this.hoverHandler.handle(event);
  }
}
