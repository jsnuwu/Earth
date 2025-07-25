import * as THREE from "three";

export class Planet {
  constructor(scene, rendererDomElement, camera) {
    this.radius = 15;
    this.scene = scene;
    this.domElement = rendererDomElement;
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Line.threshold = 0.1;

    const geometry = new THREE.SphereGeometry(this.radius, 64, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x2266dd,
      flatShading: false,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.mouse = new THREE.Vector2();
    this.hovered = null;
    this.bundeslandMeshes = [];

    this.loadStates();
    this.loadWorld();
  }

  rotate(speed = 0.0005) {
    this.mesh.rotation.y += speed;
  }

  getMesh() {
    return this.mesh;
  }

  loadWorld() {
    fetch("data/custom.geo.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const features = data.features;
        console.log(`→ ${features.length} GeoJSON-Features geladen`);

        features.forEach((feature) => {
          const name = feature.properties.NAME_1 || "Unbekannt";

          const type = feature.geometry.type;
          const coords = feature.geometry.coordinates;

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

              line.userData = {
                name: name,
                originalColor: material.color.clone(),
              };

              this.mesh.add(line);
              this.bundeslandMeshes.push(line);
            });
          });

          console.log(`✓ ${name} geladen`);
        });
      })
      .catch((error) => {
        console.error("✗ Fehler beim Laden der GeoJSON:", error);
      });
  }

  loadStates() {
    fetch("data/bundeslaender.geo.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const features = data.features;
        console.log(`→ ${features.length} GeoJSON-Features geladen`);

        features.forEach((feature) => {
          const name = feature.properties.NAME || "Unbekannt";
          const type = feature.geometry.type;
          const coords = feature.geometry.coordinates;

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

              line.userData = {
                name: name,
                originalColor: material.color.clone(),
              };

              this.mesh.add(line);
              this.bundeslandMeshes.push(line);
            });
          });

          console.log(`✓ ${name} geladen`);
        });
      })
      .catch((error) => {
        console.error("✗ Fehler beim Laden der GeoJSON:", error);
      });
  }

  onMouseMove(event) {
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera.getCamera());

    const intersects = this.raycaster.intersectObjects(
      this.bundeslandMeshes,
      true
    );

    if (intersects.length === 0) {
      if (this.hovered) {
        this.hovered.material.color.copy(this.hovered.userData.originalColor);
        this.hovered = null;
      }
      return;
    }

    const obj = intersects[0].object;

    if (this.hovered !== obj) {
      if (this.hovered) {
        this.hovered.material.color.copy(this.hovered.userData.originalColor);
      }

      obj.material.color.set(0xff0000);
      this.hovered = obj;
    }
  }
}
