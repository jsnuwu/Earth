export class EarthControls {
  constructor(planetMesh, domElement) {
    this.planet = planetMesh;
    this.domElement = domElement;

    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.rotationSpeed = 0.002;

    this.rotationVelocity = { x: 0, y: 0 };

    this.enabled = true;

    this.initEvents();
  }

  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }

  initEvents() {
    this.domElement.addEventListener("mousedown", this.onMouseDown);
    this.domElement.addEventListener("mouseup", this.onMouseUp);
    this.domElement.addEventListener("mousemove", this.onMouseMove);
  }

  onMouseDown = (event) => {
    this.isDragging = true;
    this.prevMouse.x = event.clientX;
    this.prevMouse.y = event.clientY;

    this.rotationVelocity.x = 0;
    this.rotationVelocity.y = 0;
  };

  onMouseUp = () => {
    this.isDragging = false;
  };

  onMouseMove = (event) => {
    if (!this.enabled || !this.isDragging) return;

    const deltaX = event.clientX - this.prevMouse.x;
    const deltaY = event.clientY - this.prevMouse.y;

    this.rotationVelocity.y = deltaX * this.rotationSpeed;
    this.rotationVelocity.x = deltaY * this.rotationSpeed;

    this.prevMouse.x = event.clientX;
    this.prevMouse.y = event.clientY;
  };

  update() {
    if (!this.enabled) return;

    this.planet.rotation.y += this.rotationVelocity.y;
    this.planet.rotation.x += this.rotationVelocity.x;

    const limit = Math.PI / 2;
    this.planet.rotation.x = Math.max(
      -limit,
      Math.min(limit, this.planet.rotation.x)
    );

    this.rotationVelocity.x *= 0.85;
    this.rotationVelocity.y *= 0.85;

    if (Math.abs(this.rotationVelocity.x) < 0.00001)
      this.rotationVelocity.x = 0;
    if (Math.abs(this.rotationVelocity.y) < 0.00001)
      this.rotationVelocity.y = 0;
  }

  dispose() {
    this.domElement.removeEventListener("mousedown", this.onMouseDown);
    this.domElement.removeEventListener("mouseup", this.onMouseUp);
    this.domElement.removeEventListener("mousemove", this.onMouseMove);
  }
}
