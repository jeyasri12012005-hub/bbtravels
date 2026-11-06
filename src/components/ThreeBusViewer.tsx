import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Seat, Gender } from '../types/bus';
import {
  RotateCcw,
  Maximize2,
  Eye,
  Compass,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ThreeBusViewerProps {
  seats: Seat[];
  selectedSeatId: string | null;
  onSelectSeat?: (seatId: string) => void;
  onBookSeatRequest?: (seatId: string) => void;
}

export const ThreeBusViewer: React.FC<ThreeBusViewerProps> = ({
  seats,
  selectedSeatId,
  onSelectSeat,
  onBookSeatRequest,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<'orbit' | 'side' | 'interior' | 'driver'>('orbit');
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [interiorLookTip, setInteriorLookTip] = useState(false);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const seatMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(8.8, 4.4, 8.8));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.7, 0));
  const isTransitioningRef = useRef<boolean>(false);

  // Synchronize seat colors & passengers whenever `seats` or `selectedSeatId` changes
  useEffect(() => {
    if (!sceneRef.current) return;

    seats.forEach((seat) => {
      const seatGroup = seatMeshesRef.current.get(seat.id);
      if (!seatGroup) return;

      const isSelected = seat.id === selectedSeatId || seat.status === 'selected';
      const isBooked = seat.status === 'booked';

      let seatColor = 0x10b981; // Green Available
      let roughness = 0.45;
      if (isBooked) {
        seatColor = 0xef4444; // Red Booked
      } else if (isSelected) {
        seatColor = 0x3b82f6; // Blue Selected
        roughness = 0.25;
      }

      // Update seat fabric materials
      seatGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.isSeatFabric) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.color.setHex(seatColor);
          mat.roughness = roughness;
          if (isSelected) {
            mat.emissive.setHex(0x1d4ed8);
            mat.emissiveIntensity = 0.4;
          } else {
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
        }
      });

      // Update or attach 3D passenger model
      const existingPassenger = seatGroup.getObjectByName('passenger-model');
      if (existingPassenger) {
        seatGroup.remove(existingPassenger);
      }

      if (isBooked && seat.passenger) {
        const passengerGroup = createRealistic3DPassenger(seat.passenger.gender);
        passengerGroup.name = 'passenger-model';
        passengerGroup.position.set(0, 0.12, 0.04);
        seatGroup.add(passengerGroup);
      }
    });
  }, [seats, selectedSeatId]);

  // Main Three.js Scene Setup (Original Black & Gold Luxury Studio)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 620;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene with restored original Black & Gold studio atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x080e1b); // Deep luxury black-navy tone
    scene.fog = new THREE.FogExp2(0x080e1b, 0.016);

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.2, 85);
    camera.position.set(8.8, 4.4, 8.8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment map for realistic automotive reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.maxPolarAngle = Math.PI / 2 - 0.01;
    controls.minDistance = 0.4;
    controls.maxDistance = 25.0;
    controls.target.set(0, 1.7, 0);

    // Studio Quality Lighting Rig
    // Warm Key Light for gold highlights
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.3);
    keyLight.position.set(9, 13, 10);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 30;
      keyLight.shadow.camera.left = -9;
      keyLight.shadow.camera.right = 9;
      keyLight.shadow.camera.top = 9;
      keyLight.shadow.camera.bottom = -9;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    // Ambient Hemisphere Light
    const hemiLight = new THREE.HemisphereLight(0x90b4ce, 0x161d2d, 1.3);
    scene.add(hemiLight);

    // Champagne Gold Rim Light
    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.0);
    rimLight.position.set(-10, 8, -9);
    scene.add(rimLight);

    // Showroom Road Platform beneath bus
    const platformGroup = new THREE.Group();
    scene.add(platformGroup);

    // Deep Ground Floor
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x050a14,
      roughness: 0.85,
      metalness: 0.15,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = !isSoftwareGl;
    platformGroup.add(ground);

    // Realistic Asphalt Road Platform
    const roadWidth = 5.2;
    const roadLength = 22.0;
    const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x131822,
      roughness: 0.75,
      metalness: 0.1,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.y = 0.005;
    roadMesh.receiveShadow = !isSoftwareGl;
    platformGroup.add(roadMesh);

    // Gold Road Borders
    const goldLineMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, opacity: 0.75, transparent: true });
    const leftLine = new THREE.Mesh(new THREE.PlaneGeometry(0.08, roadLength - 1), goldLineMat);
    leftLine.rotation.x = -Math.PI / 2;
    leftLine.position.set(-roadWidth / 2 + 0.25, 0.01, 0);
    platformGroup.add(leftLine);

    const rightLine = new THREE.Mesh(new THREE.PlaneGeometry(0.08, roadLength - 1), goldLineMat);
    rightLine.rotation.x = -Math.PI / 2;
    rightLine.position.set(roadWidth / 2 - 0.25, 0.01, 0);
    platformGroup.add(rightLine);

    // Center Dashes
    for (let z = -9; z <= 9; z += 3.0) {
      const dash = new THREE.Mesh(
        new THREE.PlaneGeometry(0.12, 1.4),
        new THREE.MeshBasicMaterial({ color: 0x475569, opacity: 0.45, transparent: true })
      );
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.012, z);
      platformGroup.add(dash);
    }

    // Realistic Soft Radial Contact Shadow beneath bus
    const shadowGeo = new THREE.PlaneGeometry(16.5, 5.2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d')!;
    const grad = shadowCtx.createRadialGradient(128, 64, 15, 128, 64, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowCtx.fillStyle = grad;
    shadowCtx.fillRect(0, 0, 256, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.018;
    scene.add(shadowMesh);

    // BUILD THE ENHANCED LUXURY TRANSPARENT 3D BUS (Black & Champagne Gold)
    const busGroup = new THREE.Group();
    scene.add(busGroup);

    buildOriginalBlackGoldTransparentBus(busGroup, isSoftwareGl, seatMeshesRef, seats, selectedSeatId);

    // Raycaster for 3D seat interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const seatMeshesList: THREE.Object3D[] = [];
      seatMeshesRef.current.forEach((group) => {
        group.traverse((child) => {
          if (child instanceof THREE.Mesh && child.userData.seatId) {
            seatMeshesList.push(child);
          }
        });
      });

      const intersects = raycaster.intersectObjects(seatMeshesList, false);
      if (intersects.length > 0) {
        const hitSeatId = intersects[0].object.userData.seatId;
        const targetSeat = seats.find((s) => s.id === hitSeatId);
        if (targetSeat && targetSeat.status !== 'booked') {
          if (onSelectSeat) onSelectSeat(hitSeatId);
        }
      }
    };

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const seatMeshesList: THREE.Object3D[] = [];
      seatMeshesRef.current.forEach((group) => {
        group.traverse((child) => {
          if (child instanceof THREE.Mesh && child.userData.seatId) {
            seatMeshesList.push(child);
          }
        });
      });

      const intersects = raycaster.intersectObjects(seatMeshesList, false);
      if (intersects.length > 0) {
        const hitSeatId = intersects[0].object.userData.seatId;
        const found = seats.find((s) => s.id === hitSeatId) || null;
        setHoveredSeat(found);
        renderer.domElement.style.cursor = found && found.status !== 'booked' ? 'pointer' : 'default';
      } else {
        setHoveredSeat(null);
        renderer.domElement.style.cursor = 'default';
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    // Resize listener
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 620;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      if (isTransitioningRef.current) {
        camera.position.lerp(targetCamPosRef.current, delta * 4.0);
        controls.target.lerp(targetLookAtRef.current, delta * 4.0);

        if (
          camera.position.distanceTo(targetCamPosRef.current) < 0.05 &&
          controls.target.distanceTo(targetLookAtRef.current) < 0.05
        ) {
          isTransitioningRef.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Camera Presets
  const setCameraPreset = (view: 'orbit' | 'side' | 'interior' | 'driver') => {
    setActiveView(view);
    isTransitioningRef.current = true;

    if (view === 'orbit') {
      targetCamPosRef.current.set(8.8, 4.4, 8.8);
      targetLookAtRef.current.set(0, 1.7, 0);
      if (controlsRef.current) {
        controlsRef.current.minDistance = 2.0;
        controlsRef.current.maxDistance = 25.0;
      }
      setInteriorLookTip(false);
    } else if (view === 'side') {
      targetCamPosRef.current.set(-9.6, 2.3, 0);
      targetLookAtRef.current.set(0, 1.9, 0);
      if (controlsRef.current) {
        controlsRef.current.minDistance = 2.0;
        controlsRef.current.maxDistance = 22.0;
      }
      setInteriorLookTip(false);
    } else if (view === 'interior') {
      targetCamPosRef.current.set(0, 2.0, 1.2);
      targetLookAtRef.current.set(0, 1.9, 5.0);
      if (controlsRef.current) {
        controlsRef.current.minDistance = 0.2;
        controlsRef.current.maxDistance = 6.0;
      }
      setInteriorLookTip(true);
    } else if (view === 'driver') {
      targetCamPosRef.current.set(0, 2.2, 5.8);
      targetLookAtRef.current.set(0, 1.8, -2.0);
      if (controlsRef.current) {
        controlsRef.current.minDistance = 0.2;
        controlsRef.current.maxDistance = 8.0;
      }
      setInteriorLookTip(true);
    }
  };

  return (
    <div className="relative w-full h-[600px] sm:h-[660px] md:h-[720px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Three.js Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Black & Gold Status Tag */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/30 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-black tracking-widest text-amber-400 font-serif">
            BB TRAVELS • 3D TRANSPARENT LUXURY COACH
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-medium pl-1">
          Black & Gold Finishing • Transparent Glass Body • 360° Rotation
        </div>
      </div>

      {/* Interior Hint */}
      {interiorLookTip && (
        <div className="absolute top-5 right-5 z-10 bg-slate-900/95 border border-amber-500/40 text-amber-300 text-xs px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-fade-in pointer-events-none">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Inside Cabin: Drag or swipe to look around seats & passengers</span>
        </div>
      )}

      {/* Hovered Seat Card */}
      {hoveredSeat && (
        <div className="absolute top-20 left-5 z-10 p-3.5 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl text-xs max-w-xs animate-fade-in pointer-events-auto">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="font-bold text-white text-sm">
              Seat {hoveredSeat.id} • {hoveredSeat.id.startsWith('A') ? 'Left Window' : 'Right Window'}
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                hoveredSeat.status === 'booked'
                  ? 'bg-red-950 text-red-300 border border-red-700'
                  : hoveredSeat.id === selectedSeatId
                  ? 'bg-blue-950 text-blue-300 border border-blue-700'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
              }`}
            >
              {hoveredSeat.status === 'booked'
                ? 'BOOKED (Red)'
                : hoveredSeat.id === selectedSeatId
                ? 'SELECTED (Blue)'
                : 'AVAILABLE (Green)'}
            </span>
          </div>

          {hoveredSeat.status === 'booked' && hoveredSeat.passenger ? (
            <div className="text-slate-300 text-[11px]">
              Passenger: <strong className="text-amber-400">{hoveredSeat.passenger.name}</strong> ({hoveredSeat.passenger.gender === 'male' ? 'Adult Male Model' : 'Adult Female Model'})
            </div>
          ) : (
            <div className="text-slate-400 text-[11px] flex items-center justify-between">
              <span>Fare: ₹{hoveredSeat.fare} • Tap to select</span>
              {onSelectSeat && (
                <button
                  onClick={() => onSelectSeat(hoveredSeat.id)}
                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] cursor-pointer"
                >
                  {hoveredSeat.id === selectedSeatId ? 'Deselect' : 'Select'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Control Dock (Black & Gold Theme) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[920px] pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-3xl shadow-2xl p-3 sm:p-3.5 transition-all">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
            {/* Seat Colors Legend */}
            <div className="flex items-center gap-3.5 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
                <span>Green = Available</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></span>
                <span>Red = Booked</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></span>
                <span>Blue = Selected</span>
              </div>
            </div>

            <button
              onClick={() => setHudCollapsed(!hudCollapsed)}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-xs cursor-pointer"
            >
              <span>{hudCollapsed ? 'Show Controls' : 'Hide Controls'}</span>
              {hudCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {!hudCollapsed && (
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Camera Presets */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={() => setCameraPreset('orbit')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeView === 'orbit'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>360° Exterior Orbit</span>
                </button>

                <button
                  onClick={() => setCameraPreset('side')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeView === 'side'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Side Cutaway View</span>
                </button>

                <button
                  onClick={() => setCameraPreset('interior')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeView === 'interior'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900/60'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enter Bus Interior</span>
                </button>

                <button
                  onClick={() => setCameraPreset('driver')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeView === 'driver'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>Driver Cockpit</span>
                </button>
              </div>

              {/* Booking CTA button if a seat is selected */}
              {selectedSeatId && onBookSeatRequest && (
                <button
                  onClick={() => onBookSeatRequest(selectedSeatId)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md cursor-pointer ml-auto"
                >
                  Reserve Seat {selectedSeatId} Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// PROCEDURAL LUXURY BLACK & GOLD TRANSPARENT BUS (Three.js)
// =====================================================================
function buildOriginalBlackGoldTransparentBus(
  busGroup: THREE.Group,
  isSoftwareGl: boolean,
  seatMeshesRef: React.MutableRefObject<Map<string, THREE.Group>>,
  seats: Seat[],
  selectedSeatId: string | null
) {
  // 1. Premium Metallic Navy-Black Coachwork
  const blackChassisMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a1424, // Original deep navy/black metallic finish
    roughness: 0.18,
    metalness: 0.72,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  const chromeTrimMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.9,
    roughness: 0.12,
  });

  const champagneGoldMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // Champagne Gold luxury trim
    metalness: 0.88,
    roughness: 0.2,
  });

  // 2. Lower Bus Body Frame
  const lowerBodyGeo = new THREE.BoxGeometry(2.7, 1.2, 13.8);
  const lowerBody = new THREE.Mesh(lowerBodyGeo, blackChassisMat);
  lowerBody.position.set(0, 1.1, 0);
  lowerBody.castShadow = !isSoftwareGl;
  lowerBody.receiveShadow = !isSoftwareGl;
  busGroup.add(lowerBody);

  // Chrome Lower Guard
  const chromeGuardGeo = new THREE.BoxGeometry(2.72, 0.08, 13.6);
  const chromeGuard = new THREE.Mesh(chromeGuardGeo, chromeTrimMat);
  chromeGuard.position.set(0, 0.55, 0);
  busGroup.add(chromeGuard);

  // Champagne Gold Accent Coachline Sweep
  const goldStripeGeo = new THREE.BoxGeometry(2.72, 0.08, 13.4);
  const goldStripe = new THREE.Mesh(goldStripeGeo, champagneGoldMat);
  goldStripe.position.set(0, 1.25, 0);
  busGroup.add(goldStripe);

  // 3. Interior Floor & Luxury Wood Planks Runner
  const floorGeo = new THREE.BoxGeometry(2.55, 0.08, 13.4);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x1a202c,
    roughness: 0.7,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(0, 1.72, 0);
  floor.receiveShadow = !isSoftwareGl;
  busGroup.add(floor);

  // Center Aisle Runner with soft courtesy lighting
  const aisleGeo = new THREE.BoxGeometry(0.65, 0.012, 12.8);
  const aisleMat = new THREE.MeshStandardMaterial({
    color: 0x333d4e,
    roughness: 0.75,
  });
  const aisle = new THREE.Mesh(aisleGeo, aisleMat);
  aisle.position.set(0, 1.765, 0);
  busGroup.add(aisle);

  // 4. Roof Edge Frame & Aerodynamic Spoiler (Metallic Navy-Black)
  const roofEdgeGeo = new THREE.BoxGeometry(2.65, 0.16, 13.6);
  const roofEdge = new THREE.Mesh(roofEdgeGeo, blackChassisMat);
  roofEdge.position.set(0, 3.55, 0);
  roofEdge.castShadow = !isSoftwareGl;
  busGroup.add(roofEdge);

  // Roof AC Unit (Charcoal / Gold trim)
  const acGeo = new THREE.BoxGeometry(1.6, 0.32, 3.6);
  const acMat = new THREE.MeshStandardMaterial({
    color: 0x181f2b,
    roughness: 0.45,
  });
  const acUnit = new THREE.Mesh(acGeo, acMat);
  acUnit.position.set(0, 3.75, 0.2);
  busGroup.add(acUnit);

  // 5. TRANSPARENT GLASS-STYLE BODY
  const transparentGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xdff1fb,
    transparent: true,
    opacity: 0.22,
    roughness: 0.03,
    metalness: 0.05,
    transmission: isSoftwareGl ? 0 : 0.88,
    ior: 1.52,
    reflectivity: 0.75,
    depthWrite: false,
  });

  // Left Side Transparent Glass Wall
  const leftGlassGeo = new THREE.BoxGeometry(0.04, 1.72, 13.2);
  const leftGlass = new THREE.Mesh(leftGlassGeo, transparentGlassMat);
  leftGlass.position.set(-1.32, 2.65, 0);
  busGroup.add(leftGlass);

  // Right Side Tinted Transparent Glass Wall
  const rightGlassMat = transparentGlassMat.clone();
  rightGlassMat.opacity = 0.32;
  const rightGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.72, 13.2), rightGlassMat);
  rightGlass.position.set(1.32, 2.65, 0);
  busGroup.add(rightGlass);

  // Transparent Panoramic Glass Roof
  const roofGlassMat = transparentGlassMat.clone();
  roofGlassMat.opacity = 0.28;
  const roofGlass = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 13.0), roofGlassMat);
  roofGlass.position.set(0, 3.52, 0);
  busGroup.add(roofGlass);

  // Structural Window Pillars
  for (let z = -5.5; z <= 5.5; z += 2.2) {
    const pillarGeo = new THREE.BoxGeometry(0.08, 1.75, 0.12);
    const pillarLeft = new THREE.Mesh(pillarGeo, blackChassisMat);
    pillarLeft.position.set(-1.32, 2.65, z);
    busGroup.add(pillarLeft);

    const pillarRight = new THREE.Mesh(pillarGeo, blackChassisMat);
    pillarRight.position.set(1.32, 2.65, z);
    busGroup.add(pillarRight);
  }

  // 6. Front Windshield & Aerodynamic Nose
  const frontWindshieldGeo = new THREE.BoxGeometry(2.6, 1.7, 0.06);
  const frontWindshield = new THREE.Mesh(frontWindshieldGeo, transparentGlassMat);
  frontWindshield.position.set(0, 2.65, 6.85);
  frontWindshield.rotation.x = 0.12;
  busGroup.add(frontWindshield);

  // FRONT BRANDING: Displays ONLY "BB TRAVELS" in gold serif lettering on black
  const brandCanvas = document.createElement('canvas');
  brandCanvas.width = 512;
  brandCanvas.height = 80;
  const bCtx = brandCanvas.getContext('2d')!;
  bCtx.fillStyle = '#0a101d';
  bCtx.fillRect(0, 0, 512, 80);
  bCtx.strokeStyle = '#d4af37';
  bCtx.lineWidth = 4;
  bCtx.strokeRect(6, 6, 500, 68);
  bCtx.font = 'bold 44px "Cinzel", "Times New Roman", serif';
  bCtx.fillStyle = '#d4af37';
  bCtx.textAlign = 'center';
  bCtx.textBaseline = 'middle';
  bCtx.fillText('BB TRAVELS', 256, 40);

  const brandTex = new THREE.CanvasTexture(brandCanvas);
  brandTex.colorSpace = THREE.SRGBColorSpace;
  const brandMat = new THREE.MeshBasicMaterial({ map: brandTex });
  const brandMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.38), brandMat);
  brandMesh.position.set(0, 3.42, 6.9);
  busGroup.add(brandMesh);

  // Front Projector Headlights Unit
  const lightGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
  const headlampMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.9,
  });
  [-0.95, -0.65, 0.65, 0.95].forEach((xPos) => {
    const lamp = new THREE.Mesh(lightGeo, headlampMat);
    lamp.rotation.x = Math.PI / 2;
    lamp.position.set(xPos, 1.1, 6.92);
    busGroup.add(lamp);
  });

  // Front Chrome BB Emblem on grille
  const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 32), champagneGoldMat);
  emblem.rotation.x = Math.PI / 2;
  emblem.position.set(0, 1.15, 6.93);
  busGroup.add(emblem);

  // Exterior Aerodynamic Side Mirrors
  const mirrorArmMat = new THREE.MeshStandardMaterial({ color: 0x111622 });
  const mirrorLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.18), mirrorArmMat);
  mirrorLeft.position.set(-1.42, 2.7, 6.6);
  busGroup.add(mirrorLeft);

  const mirrorRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.18), mirrorArmMat);
  mirrorRight.position.set(1.42, 2.7, 6.6);
  busGroup.add(mirrorRight);

  // 7. Driver Cockpit at Front
  const dashboard = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.55, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.6 })
  );
  dashboard.position.set(0, 2.05, 6.2);
  busGroup.add(dashboard);

  // Steering Wheel
  const steeringWheel = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.03, 12, 24),
    new THREE.MeshStandardMaterial({ color: 0x222630, metalness: 0.4 })
  );
  steeringWheel.position.set(0.65, 2.45, 5.95);
  steeringWheel.rotation.x = -Math.PI / 3;
  busGroup.add(steeringWheel);

  // Driver Seat
  const driverSeat = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.8, 0.55),
    new THREE.MeshStandardMaterial({ color: 0x1a2130, roughness: 0.5 })
  );
  driverSeat.position.set(0.65, 2.15, 5.35);
  busGroup.add(driverSeat);

  // 8. Wheels & Multi-Axles Assembly
  const wheelPositions = [
    { x: -1.35, z: 4.8 },  // Front Left
    { x: 1.35, z: 4.8 },   // Front Right
    { x: -1.35, z: -3.8 }, // Rear Axle 1 Left
    { x: 1.35, z: -3.8 },  // Rear Axle 1 Right
    { x: -1.35, z: -5.0 }, // Rear Axle 2 Left
    { x: 1.35, z: -5.0 },  // Rear Axle 2 Right
  ];

  const tireGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.32, 24);
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x16181f,
    roughness: 0.82,
  });
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xdde2ea,
    metalness: 0.85,
    roughness: 0.18,
  });

  wheelPositions.forEach((pos) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(pos.x, 0.52, pos.z);

    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = !isSoftwareGl;
    wheelGroup.add(tire);

    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.33, 16), rimMat);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // Gold Center Hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16), champagneGoldMat);
    hub.rotation.z = Math.PI / 2;
    wheelGroup.add(hub);

    busGroup.add(wheelGroup);
  });

  // 9. LUXURY PASSENGER SEATS (20 SEATS: A1-A10 & B1-B10)
  seatMeshesRef.current.clear();

  for (let row = 1; row <= 10; row++) {
    const zPos = 4.2 - (row - 1) * 0.92;

    // Row A (Left Window, X = -0.75)
    const seatIdA = `A${row}`;
    const seatDataA = seats.find((s) => s.id === seatIdA);
    const seatGroupA = create3DSeatMesh(seatIdA, seatDataA, isSoftwareGl, selectedSeatId);
    seatGroupA.position.set(-0.75, 1.76, zPos);
    busGroup.add(seatGroupA);
    seatMeshesRef.current.set(seatIdA, seatGroupA);

    // Row B (Right Window, X = +0.75)
    const seatIdB = `B${row}`;
    const seatDataB = seats.find((s) => s.id === seatIdB);
    const seatGroupB = create3DSeatMesh(seatIdB, seatDataB, isSoftwareGl, selectedSeatId);
    seatGroupB.position.set(0.75, 1.76, zPos);
    busGroup.add(seatGroupB);
    seatMeshesRef.current.set(seatIdB, seatGroupB);
  }
}

// =====================================================================
// INDIVIDUAL PASSENGER SEAT BUILDER
// =====================================================================
function create3DSeatMesh(
  seatId: string,
  seatData: Seat | undefined,
  isSoftwareGl: boolean,
  selectedSeatId: string | null
): THREE.Group {
  const seatGroup = new THREE.Group();
  seatGroup.name = `seat-${seatId}`;

  const isSelected = seatId === selectedSeatId || seatData?.status === 'selected';
  const isBooked = seatData?.status === 'booked';

  let seatColor = 0x10b981; // Green Available
  let roughness = 0.45;
  if (isBooked) {
    seatColor = 0xef4444; // Red Booked
  } else if (isSelected) {
    seatColor = 0x3b82f6; // Blue Selected
    roughness = 0.25;
  }

  // Steel Mounting Pedestal
  const pedestalMat = new THREE.MeshStandardMaterial({
    color: 0x333b4d,
    metalness: 0.6,
    roughness: 0.4,
  });
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.1), pedestalMat);
  pedestal.position.set(0, 0.125, 0);
  seatGroup.add(pedestal);

  // Seat Fabric Material
  const fabricMat = new THREE.MeshStandardMaterial({
    color: seatColor,
    roughness: roughness,
    metalness: 0.12,
  });
  if (isSelected) {
    fabricMat.emissive.setHex(0x1d4ed8);
    fabricMat.emissiveIntensity = 0.35;
  }

  // Ergonomic Seat Cushion
  const cushionGeo = new THREE.BoxGeometry(0.52, 0.16, 0.52);
  const cushion = new THREE.Mesh(cushionGeo, fabricMat);
  cushion.position.set(0, 0.32, 0);
  cushion.castShadow = !isSoftwareGl;
  cushion.userData = { isSeatFabric: true, seatId: seatId };
  seatGroup.add(cushion);

  // Reclined Backrest
  const backrestGeo = new THREE.BoxGeometry(0.48, 0.65, 0.14);
  const backrest = new THREE.Mesh(backrestGeo, fabricMat);
  backrest.position.set(0, 0.68, -0.2);
  backrest.rotation.x = -0.15;
  backrest.castShadow = !isSoftwareGl;
  backrest.userData = { isSeatFabric: true, seatId: seatId };
  seatGroup.add(backrest);

  // Headrest Cushion
  const headrestGeo = new THREE.BoxGeometry(0.32, 0.22, 0.12);
  const headrest = new THREE.Mesh(headrestGeo, fabricMat);
  headrest.position.set(0, 1.05, -0.26);
  headrest.rotation.x = -0.15;
  headrest.userData = { isSeatFabric: true, seatId: seatId };
  seatGroup.add(headrest);

  // Armrests
  const armrestMat = new THREE.MeshStandardMaterial({ color: 0x1f2430, roughness: 0.5 });
  const armrestLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.42), armrestMat);
  armrestLeft.position.set(-0.28, 0.46, 0.02);
  seatGroup.add(armrestLeft);

  const armrestRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.42), armrestMat);
  armrestRight.position.set(0.28, 0.46, 0.02);
  seatGroup.add(armrestRight);

  // Seat Number Label
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 64;
  labelCanvas.height = 64;
  const lCtx = labelCanvas.getContext('2d')!;
  lCtx.fillStyle = '#0f172a';
  lCtx.fillRect(0, 0, 64, 64);
  lCtx.font = 'bold 36px monospace';
  lCtx.fillStyle = '#ffffff';
  lCtx.textAlign = 'center';
  lCtx.textBaseline = 'middle';
  lCtx.fillText(seatId, 32, 32);
  const labelTex = new THREE.CanvasTexture(labelCanvas);
  labelTex.colorSpace = THREE.SRGBColorSpace;
  const labelMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.16, 0.16),
    new THREE.MeshBasicMaterial({ map: labelTex })
  );
  labelMesh.position.set(0, 1.05, -0.19);
  labelMesh.rotation.x = -0.15;
  seatGroup.add(labelMesh);

  // If already booked, attach realistic 3D passenger model
  if (isBooked && seatData?.passenger) {
    const passengerGroup = createRealistic3DPassenger(seatData.passenger.gender);
    passengerGroup.name = 'passenger-model';
    passengerGroup.position.set(0, 0.12, 0.04);
    seatGroup.add(passengerGroup);
  }

  return seatGroup;
}

// =====================================================================
// PROCEDURAL REALISTIC 3D PASSENGER CHARACTERS (MALE & FEMALE)
// =====================================================================

function createFaceTexture(gender: 'male' | 'female'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  if (gender === 'female') {
    ctx.fillStyle = '#df9e7b';
    ctx.fillRect(0, 0, 256, 256);

    // Cheek soft blush
    const cheekGrad = ctx.createRadialGradient(70, 140, 5, 70, 140, 45);
    cheekGrad.addColorStop(0, 'rgba(219, 112, 112, 0.35)');
    cheekGrad.addColorStop(1, 'rgba(223, 158, 123, 0)');
    ctx.fillStyle = cheekGrad;
    ctx.beginPath();
    ctx.arc(70, 140, 45, 0, Math.PI * 2);
    ctx.fill();

    const cheekGradR = ctx.createRadialGradient(186, 140, 5, 186, 140, 45);
    cheekGradR.addColorStop(0, 'rgba(219, 112, 112, 0.35)');
    cheekGradR.addColorStop(1, 'rgba(223, 158, 123, 0)');
    ctx.fillStyle = cheekGradR;
    ctx.beginPath();
    ctx.arc(186, 140, 45, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows
    ctx.strokeStyle = '#1a1310';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(60, 95);
    ctx.quadraticCurveTo(90, 85, 115, 95);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(141, 95);
    ctx.quadraticCurveTo(166, 85, 196, 95);
    ctx.stroke();

    // Eyes with lashes & light reflection
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(88, 112, 16, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(168, 112, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#221612';
    ctx.beginPath();
    ctx.arc(88, 112, 8, 0, Math.PI * 2);
    ctx.arc(168, 112, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(86, 110, 2.5, 0, Math.PI * 2);
    ctx.arc(166, 110, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Traditional Maroon Bindi
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.arc(128, 88, 5, 0, Math.PI * 2);
    ctx.fill();

    // Soft Smile Lips
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.ellipse(128, 180, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#ce8a63';
    ctx.fillRect(0, 0, 256, 256);

    // Eyebrows
    ctx.strokeStyle = '#181310';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(58, 98);
    ctx.lineTo(112, 94);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(144, 94);
    ctx.lineTo(198, 98);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(85, 112, 15, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(171, 112, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1c130e';
    ctx.beginPath();
    ctx.arc(85, 112, 7.5, 0, Math.PI * 2);
    ctx.arc(171, 112, 7.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(83, 110, 2, 0, Math.PI * 2);
    ctx.arc(169, 110, 2, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.strokeStyle = 'rgba(150, 80, 45, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(128, 105);
    ctx.lineTo(125, 145);
    ctx.lineTo(133, 147);
    ctx.stroke();

    // Lips
    ctx.fillStyle = '#9a4c32';
    ctx.beginPath();
    ctx.ellipse(128, 180, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createKurtiFabricTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#781229';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let i = 0; i < 256; i += 6) {
    ctx.fillRect(i, 0, 2, 256);
    ctx.fillRect(0, i, 256, 2);
  }

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(128, 20, 60, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  [80, 110, 128, 146, 176].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, 70, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createRealistic3DPassenger(gender: Gender): THREE.Group {
  const model = new THREE.Group();

  if (gender === 'male') {
    const faceTex = createFaceTexture('male');
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xce8a63,
      roughness: 0.6,
      metalness: 0.04,
    });
    const faceMat = new THREE.MeshStandardMaterial({
      map: faceTex,
      roughness: 0.55,
      metalness: 0.04,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x161311,
      roughness: 0.85,
    });
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f, // Smart fitted navy casual shirt
      roughness: 0.65,
    });
    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x242831,
      roughness: 0.75,
    });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.44, 0.22), shirtMat);
    torso.position.set(0, 0.48, -0.12);
    torso.rotation.x = -0.12;
    model.add(torso);

    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.12), shirtMat);
    collar.position.set(0, 0.72, -0.14);
    model.add(collar);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.07, 0.1, 12), skinMat);
    neck.position.set(0, 0.74, -0.14);
    model.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 16), faceMat);
    head.position.set(0, 0.87, -0.16);
    head.rotation.y = -Math.PI / 2;
    model.add(head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
    hair.position.set(0, 0.89, -0.16);
    hair.rotation.x = -0.1;
    model.add(hair);

    const lap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.34), pantsMat);
    lap.position.set(0, 0.26, 0.02);
    model.add(lap);

    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.1), shirtMat);
    leftArm.position.set(-0.21, 0.42, -0.06);
    leftArm.rotation.x = 0.3;
    model.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.1), shirtMat);
    rightArm.position.set(0.21, 0.42, -0.06);
    rightArm.rotation.x = 0.3;
    model.add(rightArm);

    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), skinMat);
    leftHand.position.set(-0.12, 0.31, 0.12);
    model.add(leftHand);

    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), skinMat);
    rightHand.position.set(0.12, 0.31, 0.12);
    model.add(rightHand);
  } else {
    const faceTex = createFaceTexture('female');
    const kurtiTex = createKurtiFabricTexture();

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xdf9e7b,
      roughness: 0.55,
      metalness: 0.04,
    });
    const faceMat = new THREE.MeshStandardMaterial({
      map: faceTex,
      roughness: 0.5,
      metalness: 0.04,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x14100e,
      roughness: 0.85,
    });
    const kurtiMat = new THREE.MeshStandardMaterial({
      map: kurtiTex,
      color: 0x8a1532,
      roughness: 0.65,
    });
    const dupattaMat = new THREE.MeshStandardMaterial({
      color: 0x0e7490,
      roughness: 0.7,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2,
    });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.44, 0.2), kurtiMat);
    torso.position.set(0, 0.48, -0.12);
    torso.rotation.x = -0.12;
    model.add(torso);

    const dupatta = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.48, 0.22), dupattaMat);
    dupatta.position.set(-0.11, 0.46, -0.1);
    dupatta.rotation.z = -0.05;
    model.add(dupatta);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.065, 0.1, 12), skinMat);
    neck.position.set(0, 0.74, -0.14);
    model.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.108, 16, 16), faceMat);
    head.position.set(0, 0.86, -0.16);
    head.rotation.y = -Math.PI / 2;
    model.add(head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
    hair.position.set(0, 0.88, -0.16);
    model.add(hair);

    const hairBun = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), hairMat);
    hairBun.position.set(0, 0.94, -0.22);
    model.add(hairBun);

    const earringL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), goldMat);
    earringL.position.set(-0.115, 0.82, -0.15);
    model.add(earringL);

    const earringR = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), goldMat);
    earringR.position.set(0.115, 0.82, -0.15);
    model.add(earringR);

    const lap = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.32), kurtiMat);
    lap.position.set(0, 0.26, 0.02);
    model.add(lap);

    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.3, 0.09), kurtiMat);
    leftArm.position.set(-0.19, 0.42, -0.06);
    leftArm.rotation.x = 0.3;
    model.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.3, 0.09), kurtiMat);
    rightArm.position.set(0.19, 0.42, -0.06);
    rightArm.rotation.x = 0.3;
    model.add(rightArm);

    const hands = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), skinMat);
    hands.position.set(0, 0.31, 0.12);
    model.add(hands);

    const bangle = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.008, 8, 16), goldMat);
    bangle.position.set(0.15, 0.33, 0.06);
    bangle.rotation.y = Math.PI / 2;
    model.add(bangle);
  }

  return model;
}

export default ThreeBusViewer;
