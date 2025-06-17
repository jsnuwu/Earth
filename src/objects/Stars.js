import * as THREE from 'three';

export class Stars{
    constructor(count = 1000){
        const geometry = new THREE.BufferGeometry();
        const positions = [];

        for(let i = 0; i < count; i++){
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            positions.push(x, y, z);
        }

        geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
        );

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1,
        });
        this.points = new THREE.Points(geometry, material);
    }

    getMesh(){
        return this.points;
    }

}