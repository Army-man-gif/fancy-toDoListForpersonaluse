import { useEffect } from "react";
import * as THREE from "three";
import "./index.css";

function Three() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let cube;

    const loader = new THREE.TextureLoader();

    loader.load(import.meta.env.BASE_URL + "/download (1).jpeg", (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);

      const geometry = new THREE.BoxGeometry(2.4, 2.4, 2.4);
      const material = new THREE.MeshPhongMaterial({ map: texture });
      renderer.setClearColor(0xff0000);
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      const light = new THREE.AmbientLight("rgb(255 255 255)"); // soft white light
      scene.add(light);

      const spotLight = new THREE.SpotLight("rgb(255 255 255)");
      spotLight.position.set(5, 5, 5);
      spotLight.castShadow = true;
      scene.add(spotLight);
      draw();
    });

    function draw() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);

      requestAnimationFrame(draw);
    }
  }, []);

  return <></>;
}

export default Three;
