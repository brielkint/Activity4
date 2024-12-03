// Importing Three.js and OrbitControls
import * as THREE from 'three';  // Import Three.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';  // Import OrbitControls

// Scene setup
const scene = new THREE.Scene();

// Initial window size and camera setup
let sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 7;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl') });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Particle system setup for stars (galaxy effect)
const particleCount = 10000;  // Number of particles
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);  // Each particle has x, y, z positions
const colors = new Float32Array(particleCount * 3);  // Each particle has RGB colors

// Create particles with random positions and colors
for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 20;  // x position
  positions[i * 3 + 1] = (Math.random() - 0.5) * 20;  // y position
  positions[i * 3 + 2] = (Math.random() - 0.5) * 20;  // z position

  // Color gradient to simulate colorful galaxy
  colors[i * 3] = Math.random();  // Red
  colors[i * 3 + 1] = Math.random();  // Green
  colors[i * 3 + 2] = Math.random();  // Blue
}

// Add the positions and colors attributes to the geometry
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Particle material (PointsMaterial)
const material = new THREE.PointsMaterial({
  size: 0.05,  // Particle size
  vertexColors: true,  // Enable vertex colors
  sizeAttenuation: true,  // Adjust size based on camera distance
  transparent: true,
  opacity: 0.7
});

// Create particle system (Points)
const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xff0000, 1, 10);
pointLight.position.set(-3, 3, 0);
scene.add(pointLight);

const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.5);
scene.add(hemisphereLight);

// Add planets to the galaxy (colorful and textured)
const textureLoader = new THREE.TextureLoader();

function createPlanet(radius, texture, distance, orbitSpeed, color) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    color: color || new THREE.Color(Math.random(), Math.random(), Math.random())  // Random color if no texture
  });
  const planet = new THREE.Mesh(geometry, material);

  planet.position.x = distance;
  scene.add(planet);

  return {
    planet,
    orbitSpeed
  };
}

// Create colorful planets with textures and random colors
const earthTexture = textureLoader.load('https://example.com/earth.jpg');
const marsTexture = textureLoader.load('https://example.com/mars.jpg');
const jupiterTexture = textureLoader.load('https://example.com/jupiter.jpg');

const earth = createPlanet(1, earthTexture, 5, 0.005);  // Earth with texture
const mars = createPlanet(0.8, marsTexture, 8, 0.003);   // Mars with texture
const jupiter = createPlanet(1.5, jupiterTexture, 10, 0.002);  // Jupiter with texture

// Shooting stars setup
const shootingStars = [];
const starCount = 100;  // Number of shooting stars

for (let i = 0; i < starCount; i++) {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    size: 0.2,
    color: new THREE.Color(Math.random(), Math.random(), Math.random())
  });

  const starPosition = new Float32Array(3);
  starPosition[0] = (Math.random() - 0.5) * 20;  // x
  starPosition[1] = (Math.random() - 0.5) * 20;  // y
  starPosition[2] = (Math.random() - 0.5) * 20;  // z

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPosition, 3));

  const star = new THREE.Points(starGeometry, starMaterial);
  shootingStars.push({
    star,
    direction: new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1),
    speed: Math.random() * 0.1 + 0.1
  });

  scene.add(star);
}

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

// Window resizing functionality
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Fullscreen functionality
window.addEventListener('dblclick', () => {
  const canvas = renderer.domElement;
  if (!document.fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.mozRequestFullScreen) {
      canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
      canvas.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
});

// Animation loop to rotate particles, planets, and shooting stars
function animate() {
  // Animate particles with a "raging wave" effect
  const positions = particles.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] = Math.sin(positions[i] + Date.now() * 0.001) * 2;
  }
  particles.geometry.attributes.position.needsUpdate = true;

  // Rotate the particle system to simulate galaxy rotation
  particles.rotation.x += 0.001;
  particles.rotation.y += 0.001;

  // Animate planets' orbit
  earth.planet.rotation.y += earth.orbitSpeed;
  mars.planet.rotation.y += mars.orbitSpeed;
  jupiter.planet.rotation.y += jupiter.orbitSpeed;

  earth.planet.position.x = Math.cos(Date.now() * earth.orbitSpeed) * 5;
  earth.planet.position.z = Math.sin(Date.now() * earth.orbitSpeed) * 5;

  mars.planet.position.x = Math.cos(Date.now() * mars.orbitSpeed) * 8;
  mars.planet.position.z = Math.sin(Date.now() * mars.orbitSpeed) * 8;

  jupiter.planet.position.x = Math.cos(Date.now() * jupiter.orbitSpeed) * 10;
  jupiter.planet.position.z = Math.sin(Date.now() * jupiter.orbitSpeed) * 10;

  // Animate shooting stars
  shootingStars.forEach(star => {
    star.star.position.add(star.direction.clone().multiplyScalar(star.speed));
    // Reset position if the star goes out of bounds
    if (star.star.position.length() > 20) {
      star.star.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
    }
  });

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
