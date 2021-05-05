import * as THREE from 'three';
import { Colors } from '../utils/Colors';

export default class Earth {
  mesh: THREE.Mesh;
  constructor() {
    const geom = new THREE.OctahedronGeometry(180, 3);

    // rotate the geometry on the x axis
    geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    // create the material
    const mat = new THREE.MeshPhongMaterial({
      color: Colors.blue,
      transparent: false,
      opacity: 1,
      flatShading: true,
      fog: true
    });

    // To create an object in Three.js, we have to create a mesh
    // which is a combination of a geometry and some material
    this.mesh = new THREE.Mesh(geom, mat);

    // Allow the sea to receive shadows
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
  }
}
