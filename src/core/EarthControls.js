export class EarthControls {
  constructor(planetMesh, domElement) {
    this.planet = planetMesh;
    this.domElement = domElement;

    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.rotationSpeed = 0.005;

    this.initEvents();
  }

    enable() {
    this.enabled = true;
    }
    disable() {
    this.enabled = false;
    }

  initEvents() {
    this.domElement.addEventListener('mousedown', this.onMouseDown);
    this.domElement.addEventListener('mouseup', this.onMouseUp);
    this.domElement.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseDown = (event) => {
    this.isDragging = true;
    this.prevMouse.x = event.clientX;
    this.prevMouse.y = event.clientY;
  };

  onMouseUp = () => {
    this.isDragging = false;
  };

onMouseMove = (event) => {
  if (!this.enabled || !this.isDragging) return;

  const deltaX = event.clientX - this.prevMouse.x;
  const deltaY = event.clientY - this.prevMouse.y;

  this.planet.rotation.y += deltaX * this.rotationSpeed;
  this.planet.rotation.x += deltaY * this.rotationSpeed;

  const limit = Math.PI / 2;
  this.planet.rotation.x = Math.max(-limit, Math.min(limit, this.planet.rotation.x));

  this.prevMouse.x = event.clientX;
  this.prevMouse.y = event.clientY;
};


  dispose() {
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('mouseup', this.onMouseUp);
    this.domElement.removeEventListener('mousemove', this.onMouseMove);
  }


  
}
