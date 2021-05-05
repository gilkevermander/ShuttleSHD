import * as THREE from 'three';
import { Colors } from '../utils/Colors';

export default class Brick {
  mesh: THREE.Mesh;
  constructor() {
    let geom = new THREE.TetrahedronGeometry(8, 2);
    let mat = new THREE.MeshPhongMaterial({
      color: Colors.red,
      shininess: 0,
      specular: 0xffffff,
      flatShading: true,
    });
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.castShadow = true;
  }
}
