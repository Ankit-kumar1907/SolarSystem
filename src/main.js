import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById('progress-bar');
const loadingScreen = document.getElementById('loading-screen');

loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
    const progressPercentage = (itemsLoaded / itemsTotal) * 100;
    progressBar.value = progressPercentage;
};

loadingManager.onLoad = function() {
    loadingScreen.style.display = 'none';
};

const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
const textureLoader = new THREE.TextureLoader(loadingManager);

// --- RENDERER & SCENE SETUP ---
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-90, 140, 260); 

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 5000, 500); 
scene.add(pointLight);

scene.background = cubeTextureLoader.load([
    'img/stars.jpg',
    'img/stars.jpg',
    'img/stars.jpg',
    'img/stars.jpg',
    'img/stars.jpg',
    'img/stars.jpg'
]);

// --- THE SUN ---
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
// FIXED: Removed the leading slash from the path
const sunMat = new THREE.MeshBasicMaterial({ map: textureLoader.load('img/sun.jpg') });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// --- MERCURY ---
const mercuryGeo = new THREE.SphereGeometry(3.2, 30, 30);
// FIXED: Removed the leading slash from the path
const mercuryMat = new THREE.MeshStandardMaterial({ map: textureLoader.load('img/mercury.jpg') });
const mercury = new THREE.Mesh(mercuryGeo, mercuryMat);
const mercuryObj = new THREE.Object3D();
mercuryObj.add(mercury);
scene.add(mercuryObj);
mercury.position.x = 28;

function createPlanet(size, texturePath, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({ map: textureLoader.load(texturePath) });
    const mesh = new THREE.Mesh(geo, mat);
    
    const obj = new THREE.Object3D();
    obj.add(mesh);
    scene.add(obj);
    
    mesh.position.x = position;
    
    if (ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);

        const ringMat = new THREE.MeshBasicMaterial({ 
            map: textureLoader.load(ring.texture), 
            side: THREE.DoubleSide, 
            transparent: true 
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }   
    return { mesh, obj };
}

// --- GENERATE ALL REMAINING PLANETS ---
// FIXED: Removed leading slashes from all texture argument strings below
const venus = createPlanet(5.8, 'img/venus.jpg', 44);
const earth = createPlanet(6, 'img/earth.jpg', 62);
const mars = createPlanet(4, 'img/mars.jpg', 78);
const jupiter = createPlanet(12, 'img/jupiter.jpg', 106);

const saturn = createPlanet(10, 'img/saturn.jpg', 138, {
    innerRadius: 13,
    outerRadius: 22,
    texture: 'img/saturn-ring.png'
});

const uranus = createPlanet(7, 'img/uranus.jpg', 176, {
    innerRadius: 9,
    outerRadius: 15,
    texture: 'img/uranus-ring.png'
});

const neptune = createPlanet(7, 'img/neptune.jpg', 206);
const pluto = createPlanet(2.8, 'img/pluto.jpg', 226);

function animate(){
    // Individual spins
    sun.rotation.y += 0.004; 
    mercury.rotation.y += 0.004;
    venus.mesh.rotation.y += 0.002;
    earth.mesh.rotation.y += 0.02;
    mars.mesh.rotation.y += 0.018;
    jupiter.mesh.rotation.y += 0.04;
    saturn.mesh.rotation.y += 0.038;
    uranus.mesh.rotation.y += 0.03;
    neptune.mesh.rotation.y += 0.032;
    pluto.mesh.rotation.y += 0.008;

    // Independent system orbital revolutions
    mercuryObj.rotation.y += 0.04;
    venus.obj.rotation.y += 0.015;
    earth.obj.rotation.y += 0.01;
    mars.obj.rotation.y += 0.008;
    jupiter.obj.rotation.y += 0.002;
    saturn.obj.rotation.y += 0.0009;
    uranus.obj.rotation.y += 0.0004;
    neptune.obj.rotation.y += 0.0001;
    pluto.obj.rotation.y += 0.00007;
    
    renderer.render(scene, camera);
}

window.addEventListener('resize', function()  {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.setAnimationLoop(animate);

export {scene, camera, textureLoader, animate};