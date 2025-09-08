import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(50, 50, 100);
scene.add(dirLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;

const buildingGroup = new THREE.Group();
scene.add(buildingGroup);

fetch("europe_plaza.osm")
  .then(res => res.text())
  .then(osmText => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(osmText, "application/xml");

    const nodeElements = xmlDoc.getElementsByTagName("node");
    const nodes = {};
    for (let node of nodeElements) {
      const id = node.getAttribute("id");
      const lat = parseFloat(node.getAttribute("lat"));
      const lon = parseFloat(node.getAttribute("lon"));
      nodes[id] = { lat, lon };
    }

    const wayElements = xmlDoc.getElementsByTagName("way");
    for (let way of wayElements) {
      const nds = way.getElementsByTagName("nd");
      const coords = [];
      for (let nd of nds) {
        const ref = nd.getAttribute("ref");
        if (nodes[ref]) coords.push([nodes[ref].lon, nodes[ref].lat]);
      }

      if (coords.length >= 3) {
        let centerX = 0, centerY = 0;
        coords.forEach(([lon, lat]) => { centerX += lon; centerY += lat; });
        centerX /= coords.length;
        centerY /= coords.length;

        const scale = 1e7;
        const coordsScaled = coords.map(([lon, lat]) => [(lon - centerX) * scale, (lat - centerY) * scale]);

        const shape = new THREE.Shape();
        coordsScaled.forEach(([x, y], i) => {
          if (i === 0) shape.moveTo(x, y);
          else shape.lineTo(x, y);
        });

        const xVals = coordsScaled.map(c => c[0]);
        const yVals = coordsScaled.map(c => c[1]);
        const width = Math.max(...xVals) - Math.min(...xVals);
        const depth = Math.max(...yVals) - Math.min(...yVals);
        const heightTag = way.querySelector('tag[k="building:levels"]');
        const baseHeight = heightTag ? parseInt(heightTag.getAttribute("v")) * 3 : 10;
        const height = Math.max(baseHeight, Math.max(width, depth) * 0.8);

        const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
        const mesh = new THREE.Mesh(geometry, material);
        buildingGroup.add(mesh);
      }
    }

    const box = new THREE.Box3().setFromObject(buildingGroup);
    const center = box.getCenter(new THREE.Vector3());
    buildingGroup.position.sub(center);

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraZ = maxDim / (2 * Math.tan(fov / 2));
    camera.position.set(0, 0, cameraZ * 1.5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    controls.update();
  });

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.update();
});
