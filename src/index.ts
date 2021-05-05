import * as THREE from 'three';
import Cloud from './classes/Cloud';
import CloudRound from './classes/CloudRound';
import Earth from './classes/Earth';
import Sky from './classes/Sky';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Colors } from './utils/Colors';
import Brick from './classes/Brick';

{
  //GAME VARIABLES//
  let scene;
  let camera;
  let fieldOfView: number;
  let aspectRatio: number;
  let nearPlane: number;
  let farPlane: number;
  let HEIGHT: number;
  let WIDTH: number;
  let renderer;
  let container;

  let hemisphereLight;
  let shadowLight;
  let ambientLight;

  let game;
  let start;
  let climb = false;

  const init = () => {
    createScene();
    creatLights();
    createEarth();
    creatSky();
    creatRocket();
    creatBrick();

    events();

    loop();
    renderer.render(scene, camera);
  };

  const events = () => {
    document.addEventListener('mousemove', handleMouseMove, false);
    //startknop
    start = document.getElementById('start');
    start.addEventListener('click', handleClickStart, false);
  };

  const handleClickStart = () => {
    console.log('start');
    //start game
    start.style.display = "none"
    climb = true;
  };

  let mousePos = { x: 0, y: 0 };

  // now handle the mousemove event

  const handleMouseMove = (event) => {
    // here we are converting the mouse position value received
    // to a normalized value varying between -1 and 1;
    // this is the formula for the horizontal axis:

    var tx = -1 + (event.clientX / WIDTH) * 2;

    // for the vertical axis, we need to inverse the formula
    // because the 2D y-axis goes the opposite direction of the 3D y-axis

    var ty = 1 - (event.clientY / HEIGHT) * 2;
    mousePos = { x: tx, y: ty };
  };

  const handleWindowResize = () => {
    // update height and width of the renderer and the camera
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  };

  window.addEventListener('load', init, false);

  const createScene = () => {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    //create a scene
    scene = new THREE.Scene();

    //create a fog
    scene.fog = new THREE.Fog(Colors.purple, 1, 600);

    //create a camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    // Set the position of the camera
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 50;

    // Create the renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // fill the entire screen
    renderer.setSize(WIDTH, HEIGHT);

    renderer.shadowMap.enabled = true;
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
  };

  const creatLights = () => {
    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.9);
    shadowLight = new THREE.DirectionalLight(0xffffff, 0.3);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;
    ambientLight = new THREE.AmbientLight(0xdc8874, 0.4);
    scene.add(ambientLight);
    //add to scene
    scene.add(hemisphereLight);
    scene.add(shadowLight);
  };

  let earth;
  //let clouds;
  const createEarth = () => {
    earth = new Earth();
    earth.mesh.position.y = -150;
    // add the mesh of the sea to the scene
    scene.add(earth.mesh);
  };

  let sky;
  const creatSky = () => {
    sky = new Sky();
    const light2 = new THREE.DirectionalLight(Colors.darkBlue, 0.8);
    light2.position.set(-3, -1, 0).normalize();
    scene.add(light2);
    sky.mesh.position.y = -700;
    sky.mesh.position.z = 300;
    scene.add(sky.mesh);
  };

  let brick;
  const creatBrick = () => {
    brick = new Brick();
    brick.mesh.position.y = 40;
    brick.mesh.position.z = 20;
    brick.mesh.position.x = 20;
    scene.add(brick.mesh);
  };

  let rocket;
  const creatRocket = () => {
    let loader = new GLTFLoader();
    loader.load(
      'static/assets/shuttleSHD.gltf',
      (gltf) => {
        rocket = gltf.scene;
        rocket.receiveShadow = true;
        rocket.castShadow = true;
        rocket.position.y = 40;
        rocket.position.z = 20;
        gltf.scene.traverse(function (node) {
          if ((<any>node).isMesh) {
            node.castShadow = true;
          }
        });
        scene.add(rocket);
      },
      (error) => {
        console.log('An error happened');
      }
    );
  };

  const loop = () => {
    //this.mesh.rotation.z += game.speed*deltaTime;
    sky.mesh.rotation.z += 0.0005;
    updatePlane();
    if(climb) {
      updateClimb();
    }
    // render the scene
    renderer.render(scene, camera);

    // call the loop function again
    requestAnimationFrame(loop);
  };

  const updateClimb = () => {
    sky.mesh.position.y -= 1.1;
    earth.mesh.position.y -= 1.1;
  }

  const updatePlane = () => {
    // let's move the airplane between -100 and 100 on the horizontal axis,
    // and between 25 and 175 on the vertical axis,
    // depending on the mouse position which ranges between -1 and 1 on both axes;
    // to achieve that we use a normalize function (see below)

    var targetY = normalize(mousePos.y, -0.75, 0.75, 25, 175);
    var targetX = normalize(mousePos.x, -0.75, 0.75, -100, 100);

    // update the airplane's position

    if (rocket) {
      // console.log(rocket.position.y);
      rocket.position.y = 45;
      // rocket.position.x = targetX;
      rocket.position.x += (targetX - rocket.position.x) * 0.1;

      // Rotate the plane proportionally to the remaining distance
      rocket.rotation.z = (rocket.position.x - targetX) * 0.0128;
      //rocket.rotation.x = (rocket.position.x + targetX) * 0.0064;
    }

    //rook animatie
  };

  const normalize = (v, vmin, vmax, tmin, tmax) => {
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + pc * dt;
    return tv;
  };
}
