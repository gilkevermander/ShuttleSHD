import * as THREE from 'three';
import { Colors } from '../utils/Colors';

export default class Could {
  mesh: THREE.Object3D;
  constructor() {
    this.mesh = new THREE.Object3D();

    const geom = new THREE.BoxGeometry(20, 20, 20);

    // rotate the geometry on the x axis
    geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    // create the material
    const mat = new THREE.MeshPhongMaterial({
      color: Colors.white,
    });

    var nBlocs = 3 + Math.floor(Math.random() * 3);
    for (var i = 0; i < nBlocs; i++) {
      // create the mesh by cloning the geometry
      var m = new THREE.Mesh(geom, mat);

      // set the position and the rotation of each cube randomly
      m.position.x = i * 15;
      m.position.y = Math.random() * 10;
      m.position.z = Math.random() * 10;
      m.rotation.z = Math.random() * Math.PI * 2;
      m.rotation.y = Math.random() * Math.PI * 2;

      // set the size of the cube randomly
      var s = 0.1 + Math.random() * 0.9;
      m.scale.set(s, s, s);

      // allow each cube to cast and to receive shadows
      m.castShadow = true;
      m.receiveShadow = true;

      // add the cube to the container we first created
      this.mesh.add(m);
    }
  }
}
