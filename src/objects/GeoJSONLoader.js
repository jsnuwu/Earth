import * as THREE from "three";
import { convertCoordsToSphere } from "./GeoUtils";

export class GeoJSONLoader {
  constructor(radius, parentMesh, meshArray) {
    this.radius = radius;
    this.parentMesh = parentMesh;
    this.meshArray = meshArray;
    this.namedGroups = {};
  }

  load(url, namePropKey) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const features = data.features;
        console.log(`→ ${features.length} GeoJSON-Features geladen`);

        features.forEach((feature) => {
          const name = feature.properties[namePropKey] || "Unbekannt";
          const geometryType = feature.geometry.type;
          const coords = feature.geometry.coordinates;

          const polygons = geometryType === "MultiPolygon" ? coords : [coords];

          polygons.forEach((polygon) => {
            const shape = this._createShape(polygon);

            const extrudeSettings = { depth: 0.05, bevelEnabled: false };
            const geometry3D = new THREE.ExtrudeGeometry(
              shape,
              extrudeSettings
            );

            const geometryOnSphere = this._projectShapeToSphere(geometry3D);

            const material = new THREE.MeshStandardMaterial({
              color: 0x2266dd,
              transparent: true,
              opacity: 0.5,
              side: THREE.DoubleSide,
            });

            const mesh = new THREE.Mesh(geometryOnSphere, material);
            mesh.userData = {
              name,
              originalColor: material.color.clone(),
            };
            this.parentMesh.add(mesh);

            this.meshArray.push(mesh);

            if (!this.namedGroups[name]) this.namedGroups[name] = [];
            this.namedGroups[name].push(mesh);

            polygon.forEach((ring) => {
              const outlinePoints = ring.map(([lon, lat]) =>
                convertCoordsToSphere(lat, lon, this.radius + 0.01)
              );
              const outlineGeometry = new THREE.BufferGeometry().setFromPoints(
                outlinePoints
              );
              const outlineMaterial = new THREE.LineBasicMaterial({
                color: 0x000000,
              });
              const outline = new THREE.LineLoop(
                outlineGeometry,
                outlineMaterial
              );
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

  _createShape(polygon) {
    const [outer, ...holes] = polygon;
    const shape = new THREE.Shape();

    outer.forEach(([lon, lat], i) => {
      if (i === 0) shape.moveTo(lon, lat);
      else shape.lineTo(lon, lat);
    });

    holes.forEach((holeCoords) => {
      const hole = new THREE.Path();
      holeCoords.forEach(([lon, lat], i) => {
        if (i === 0) hole.moveTo(lon, lat);
        else hole.lineTo(lon, lat);
      });
      shape.holes.push(hole);
    });

    return shape;
  }

  _projectShapeToSphere(geometry, offset = -0.1) {
    const pos = geometry.attributes.position;
    const newPos = [];

    for (let i = 0; i < pos.count; i++) {
      const lon = pos.getX(i);
      const lat = pos.getY(i);
      const point = convertCoordsToSphere(lat, lon, this.radius + offset);
      newPos.push(point.x, point.y, point.z);
    }

    const geometry3D = new THREE.BufferGeometry();
    geometry3D.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(newPos, 3)
    );
    if (geometry.index) geometry3D.setIndex(geometry.index);
    geometry3D.computeVertexNormals();

    return geometry3D;
  }
}
