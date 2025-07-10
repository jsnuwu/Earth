import * as THREE from "three";

export class Planet {
  constructor(scene) {
    this.radius = 15;
    this.scene = scene;

    this.dayTexture = new THREE.TextureLoader().load("textures/earthmap.jpeg");
    this.nightTexture = new THREE.TextureLoader().load(
      "textures/earthmap_night.jpeg"
    );
    const bumpMap = new THREE.TextureLoader().load("textures/earthbump.jpeg");
    const cloudsTexture = new THREE.TextureLoader().load(
      "textures/earthCloud.png"
    );

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

    this.mesh.add(this.cloudsMesh);

    this.isNight = false;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hovered = null;
    this.bundeslandMeshes = [];
    this.loadStates();
    
  }

  rotate(speed = 0.0005) {
    this.mesh.rotation.y += speed;

    this.cloudsMesh.rotation.y += speed * 0.4;
  }

  toggleTexture() {
    this.isNight = !this.isNight;
    this.material.map = this.isNight ? this.nightTexture : this.dayTexture;
    this.material.needsUpdate = true;
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
              const theta = (lon - 180) * (Math.PI / 180);
              const r = this.radius + 0.3; 

              const x = r * Math.sin(phi) * Math.cos(theta);
              const y = r * Math.cos(phi);
              const z = r * Math.sin(phi) * Math.sin(theta);

              return new THREE.Vector3(x, y, z);
            });

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ color: 0xff0000 }); 
            const line = new THREE.LineLoop(geometry, material);

            this.scene.add(line);
            this.bundeslandMeshes.push(line);

            console.log(`→ ${feature.properties.NAME_1}: ${points.length} Punkte`);
          });
        });
      });
    })
    .catch((error) => {
      console.error("Fehler beim Laden der GeoJSON:", error);
    });
}

}
