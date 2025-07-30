import * as THREE from "three";
import earcut from "earcut";
import { convertCoordsToSphere } from "./GeoUtils";

export class GeoJSONLoader {
  constructor(radius, parentMesh, meshArray) {
    this.radius = radius;
    this.parentMesh = parentMesh;
    this.meshArray = meshArray;
  }

  load(url, namePropKey) {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const features = data.features;
        console.log(`→ ${features.length} GeoJSON-Features geladen`);

        features.forEach((feature) => {
          const name = feature.properties[namePropKey] || "Unbekannt";
          const geometryType = feature.geometry.type;
          const coords = feature.geometry.coordinates;

          const polygons = geometryType === "MultiPolygon" ? coords : [coords];

          polygons.forEach((polygon) => {
            const outerRing = polygon[0]; 
            const holes = polygon.slice(1); 

            const { vertices, holesIdx } = this._convertToEarcutData(outerRing, holes);
            const indices = earcut(vertices, holesIdx, 3);

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setIndex(indices);
            geometry.computeVertexNormals();

            const material = new THREE.MeshStandardMaterial({
              color: 0x2266dd,
              transparent: true,
              opacity: 0.5,
              side: THREE.DoubleSide,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData = {
              name,
              originalColor: material.color.clone(),
            };

            this.parentMesh.add(mesh);
            this.meshArray.push(mesh);

            polygon.forEach((ring) => {
              const outlinePoints = ring.map(([lon, lat]) =>
                convertCoordsToSphere(lat, lon, this.radius + 0.011) 
              );

              const outlineGeometry = new THREE.BufferGeometry().setFromPoints(outlinePoints);
              const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
              const outline = new THREE.LineLoop(outlineGeometry, outlineMaterial);
              this.parentMesh.add(outline);
            });
          });

          console.log(`✓ ${name} geladen`);
        });
      })
      .catch((error) => {
        console.error("✗ Fehler beim Laden der GeoJSON:", error);
      });
  }

  _convertToEarcutData(outer, holes) {
    const allRings = [outer, ...holes];
    const vertices = [];
    const holesIdx = [];

    let vertexCount = 0;

    allRings.forEach((ring, i) => {
      if (i > 0) holesIdx.push(vertexCount / 3); 
      ring.forEach(([lon, lat]) => {
        const v = convertCoordsToSphere(lat, lon, this.radius + 0.01);
        vertices.push(v.x, v.y, v.z);
        vertexCount += 3;
      });
    });

    return { vertices, holesIdx };
  }
}
