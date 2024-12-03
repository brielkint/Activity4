// Importing Three.js and OrbitControls
import * as THREE from 'three';  // Import Three.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';  // Import OrbitControls

// Scene setup
const scene = new THREE.Scene();  // Create the scene

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;  // Position camera on the z-axis

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl') });
renderer.setSize(window.innerWidth, window.innerHeight);  // Set renderer size
document.body.appendChild(renderer.domElement);  // Attach renderer to the DOM

// Create the cube
const geometry = new THREE.BoxGeometry(1, 1, 1);  // Cube geometry
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });  // Red color material
const cube = new THREE.Mesh(geometry, material);  // Cube mesh
scene.add(cube);  // Add cube to the scene

// OrbitControls setup (to move the camera interactively)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Enable damping for smooth camera movement
controls.dampingFactor = 0.25;  // Adjust damping speed
controls.screenSpacePanning = false;  // Disable panning in screen space

// Window resizing functionality
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop to rotate the cube
function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();  // Update controls for smooth camera movement
  renderer.render(scene, camera);
  requestAnimationFrame(animate);  // Recursively call animate
}

animate();  // Start the animation loop
