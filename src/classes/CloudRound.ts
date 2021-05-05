import * as THREE from 'three';
import { Colors } from '../utils/Colors';

export default class CloudRound {
  mesh: THREE.Object3D;
  constructor() {
    this.mesh = new THREE.Object3D();

    let mat = new THREE.MeshLambertMaterial({
      color: Colors.white,
      transparent: false,
      opacity: 1,
      flatShading: true,
      fog: true,
    });
;
    const circ1 = new THREE.TetrahedronGeometry(5, 2);
    circ1.translate(-8, 2, 2);
    circ1.rotateX(6)
    circ1.computeFlatVertexNormals();
    let m1 = new THREE.Mesh(circ1, mat);
    m1.receiveShadow = true;
    m1.castShadow = true;

    const circ2 = new THREE.TetrahedronGeometry(6, 2);
    circ2.computeFlatVertexNormals();
    circ2.translate(8, 0, 0);
    circ2.rotateX(12)
    circ2.rotateY(12)
    let m2 = new THREE.Mesh(circ2, mat);
    m2.receiveShadow = true;
    m2.castShadow = true;

    const circ3 = new THREE.TetrahedronGeometry(8, 2);
    circ3.computeFlatVertexNormals();
    circ3.translate(0, 0, 0);
    let m3 = new THREE.Mesh(circ3, mat);
    m3.receiveShadow = true;
    m3.castShadow = true;

    this.mesh.add(m1, m2, m3);
  }
}
