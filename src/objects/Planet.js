import * as THREE from "three";

export class Planet {
  constructor(scene) {
    this.radius = 15;
    this.scene = scene;

    const geometry = new THREE.SphereGeometry(this.radius, 64, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x2266dd,
      flatShading: false,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hovered = null;
    this.bundeslandMeshes = [];

    this.loadStates();
  }

  rotate(speed = 0.0005) {
    this.mesh.rotation.y += speed;
  }

  getMesh() {
    return this.mesh;
  }

  loadStates() {
    console.log("loadStates() gestartet");

    fetch("data/custom.geo.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("GeoJSON geladen:", data.features.length, "Features");

        data.features.forEach((feature) => {
          const coords = feature.geometry.coordinates;
          const type = feature.geometry.type;

          const polygons = type === "MultiPolygon" ? coords : [coords];

          polygons.forEach((polygon) => {
            polygon.forEach((ring) => {
              const points = ring.map(([lon, lat]) => {
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = -lon * (Math.PI / 180);
                const r = this.radius + 0.05;

                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = r * Math.cos(phi);
                const z = r * Math.sin(phi) * Math.sin(theta);

                return new THREE.Vector3(x, y, z);
              });

              const geometry = new THREE.BufferGeometry().setFromPoints(points);
              const material = new THREE.LineBasicMaterial({ color: 0x000000 });

              const line = new THREE.LineLoop(geometry, material);

              this.mesh.add(line);
              this.bundeslandMeshes.push(line);

              console.log(
                `→ ${feature.properties.NAME_1}: ${points.length} Punkte`
              );
            });
          });
        });
      })
      .catch((error) => {
        console.error("Fehler beim Laden der GeoJSON:", error);
      });
  }
}
