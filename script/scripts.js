// Initialize Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Orbit Controls for interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // smoother camera motion
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Lighting
const light = new THREE.PointLight(0xffffff, 2, 1000);
light.position.set(0, 0, 0);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // soft light
scene.add(ambientLight);

// Create Sun
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Function to create a planet with a label
function createPlanet(size, color, distance, name) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const planet = new THREE.Mesh(geometry, material);
    
    const orbit = new THREE.Object3D();  // Empty object to represent the orbit
    orbit.position.set(0, 0, 0);
    planet.position.set(distance, 0, 0);
    orbit.add(planet);  // Planet orbits around the origin (sun)
    
    const label = createLabel(name);
    label.position.set(distance, 0, 0); // Position label next to the planet
    orbit.add(label); // Attach label to the orbiting object
    
    scene.add(orbit);
    return { planet, orbit };
}

// Function to create a text label
function createLabel(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '24px Arial';
    context.fillStyle = 'white';
    context.fillText(text, 0, 24); // Draw text on the canvas

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(3, 1.5, 1); // Adjust the size of the label
    return sprite;
}

// Function to create a star field
function createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5, // Size of the stars
        sizeAttenuation: true
    });

    const starVertices = [];
    const numberOfStars = 10000; // Number of stars to create
    for (let i = 0; i < numberOfStars; i++) {
        const x = (Math.random() - 0.5) * 2000; // Spread stars in 3D space
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

// Create Planets with Names
const mercury = createPlanet(0.5, 0xaaaaaa, 5, 'Mercury');
const venus = createPlanet(0.9, 0xffaa00, 8, 'Venus');
const earth = createPlanet(1, 0x0000ff, 11, 'Earth');
const mars = createPlanet(0.7, 0xff0000, 14, 'Mars');
const jupiter = createPlanet(1.5, 0xffcc00, 20, 'Jupiter');
const saturn = createPlanet(1.2, 0xffcc99, 25, 'Saturn');
const uranus = createPlanet(1, 0x00ccff, 30, 'Uranus');
const neptune = createPlanet(0.9, 0x0000cc, 35, 'Neptune');

// Create the star field
createStarField();

// Animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Rotate planets around the sun (their orbits)
    mercury.orbit.rotation.y += 0.02; // Mercury moves faster
    venus.orbit.rotation.y += 0.015;
    earth.orbit.rotation.y += 0.01;
    mars.orbit.rotation.y += 0.008;
    jupiter.orbit.rotation.y += 0.005;
    saturn.orbit.rotation.y += 0.004;
    uranus.orbit.rotation.y += 0.003;
    neptune.orbit.rotation.y += 0.002;

    controls.update(); // Update controls for camera interaction
    renderer.render(scene, camera);
}

// Set camera position and start the animation
camera.position.set(20, 10, 30);
animate();

// Resize handler
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
