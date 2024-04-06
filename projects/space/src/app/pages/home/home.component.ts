import { Component, OnDestroy, OnInit, effect, viewChild } from '@angular/core';
import {
  EngineComponent,
  EngineController,
  EngineService,
  GameMesh,
  Utilities3D,
  xyz,
} from '@daxur-studios/engine';
import { takeUntil } from 'rxjs';
import {
  AmbientLight,
  BufferGeometry,
  Camera,
  DirectionalLight,
  DoubleSide,
  EllipseCurve,
  Float32BufferAttribute,
  GridHelper,
  Line,
  LineBasicMaterial,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Path,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  RingGeometry,
  SphereGeometry,
  Vector3,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CelestialBodyComponent } from './mesh/mesh.component';
import { AmbientLightComponent, DirectionalLightComponent } from './mesh/light';
import {
  MeshNormalMaterialComponent,
  MeshStandardMaterialComponent,
} from './mesh/material.component';
import {
  BoxGeometryComponent,
  SphereGeometryComponent,
} from './mesh/geometry.component';
import { CarolComponent } from './mesh/carol';
import {
  Object3DComponent,
  FiberSphereComponent,
  MeshComponent,
} from './mesh/object-3d.component';
import { RaycastDirective } from './mesh/raycast';
import { GridHelperComponent } from './mesh/grid-helper.component';
import { SphereComponent } from './mesh/sphere.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FiberSphereComponent,
    CarolComponent,
    EngineComponent,
    CelestialBodyComponent,
    GridHelperComponent,
    SphereComponent,
    AmbientLightComponent,
    DirectionalLightComponent,
    MeshStandardMaterialComponent,
    MeshComponent,
    BoxGeometryComponent,
    MeshNormalMaterialComponent,
    SphereGeometryComponent,
    RaycastDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  readonly engineService = viewChild.required(EngineService);

  readonly controller = new EngineController({
    showFPS: true,
    showFPSPosition: 'top-right',
    webGLRendererParameters: { antialias: true, logarithmicDepthBuffer: true },
  });

  readonly engine = viewChild.required(EngineComponent);

  readonly geometry = new SphereGeometry(1, 64, 64);

  readonly planets: ICelestialBody[] = [
    {
      name: 'Mercury',
      orbitDiameter: 57910000000,
      physicalDiameter: 4879000,
      color: '#a9a9a9',
      orbitTilt: 7.0,
      position: [57910000000, 0, 0],
      geometry: this.geometry,
      material: new MeshStandardMaterial({
        color: '#a9a9a9',
      }),
    },
    {
      name: 'Venus',
      orbitDiameter: 108200000000,
      physicalDiameter: 12104000,
      color: '#ffd700',
      orbitTilt: 3.39,
      position: [108200000000, 0, 0],
      geometry: this.geometry,
      material: new MeshStandardMaterial({
        color: '#ffd700',
      }),
    },
    {
      name: 'Earth',
      orbitDiameter: 149600000000,
      physicalDiameter: 12742000,
      color: '#00ff00',
      orbitTilt: 0, // Reference
      position: [149600000000, 0, 0],
      geometry: this.geometry,
      material: new MeshStandardMaterial({
        color: '#00ff00',
      }),
    },
    {
      name: 'Mars',
      orbitDiameter: 227940000000,
      physicalDiameter: 6779000,
      color: '#ff4500',
      orbitTilt: 1.85,
      position: [227940000000, 0, 0],
      geometry: this.geometry,
      material: new MeshStandardMaterial({
        color: '#ff4500',
      }),
    },
    {
      name: 'Jupiter',
      orbitDiameter: 778330000000,
      physicalDiameter: 139820000,
      color: '#ff8c00',
      orbitTilt: 1.31,
      position: [778330000000, 0, 0],
      geometry: new SphereGeometry(139820000, 64, 64),
      material: new MeshStandardMaterial({
        color: '#ff8c00',
      }),
    },
    {
      name: 'Saturn',
      orbitDiameter: 1429400000000,
      physicalDiameter: 116460000,
      color: '#f0e68c',
      orbitTilt: 2.48,
      position: [1429400000000, 0, 0],
      geometry: this.geometry,
      material: new MeshStandardMaterial({
        color: '#f0e68c',
      }),
    },
    {
      name: 'Uranus',
      orbitDiameter: 2870990000000,
      physicalDiameter: 50724000,
      color: '#00ffff',
      orbitTilt: 0.77,
      position: [2870990000000, 0, 0],
      geometry: this.geometry,
      material: new MeshStandardMaterial({
        color: '#00ffff',
      }),
    },
    {
      name: 'Neptune',
      orbitDiameter: 4504300000000,
      physicalDiameter: 49244000,
      color: '#1e90ff',
      orbitTilt: 1.77,
      position: [4504300000000, 0, 0],
      geometry: this.geometry,
      material: new MeshStandardMaterial({
        color: '#1e90ff',
      }),
    },
    {
      name: 'Pluto',
      orbitDiameter: 5906380000000,
      physicalDiameter: 2377000,
      color: '#808080',
      orbitTilt: 17.16,
      position: [5906380000000, 0, 0],
      geometry: this.geometry,
      material: new MeshStandardMaterial({
        color: '#808080',
      }),
    },
  ];

  readonly items = Array.from({ length: 100 }, (_, i) => i);

  readonly tenXSpheres = [
    {
      color: 'red',
      scale: 1,
    },
    {
      color: 'orange',
      scale: 10,
    },
    {
      color: 'yellow',
      scale: 100,
    },
    {
      color: 'green',
      scale: 1000,
    },
    {
      color: 'blue',
      scale: 10000,
    },
    {
      color: 'indigo',
      scale: 100000,
    },
    {
      color: 'violet',
      scale: 1000000,
    },
    {
      color: 'white',
      scale: 10000000,
    },
    {
      color: 'black',
      scale: 100000000,
    },
    {
      color: 'gray',
      scale: 1000000000,
    },
  ];

  constructor() {
    this.addStarField();

    this.addPlanetOrbitWireFrames();

    this.controller?.camera.position.set(0, 2, 5);
  }

  controls?: TestOrbitControls;
  x = viewChild.required('x', { read: SphereComponent });
  ngOnInit(): void {
    let count = 0;
    document.body.addEventListener('click', () => {
      count++;
      this.x().scale.set(count);
    });

    console.debug(
      'does engine service exist?',
      this.engineService(),
      this.engineService().instance
    );
    setTimeout(() => {
      const engine = this.engine();

      const orbit = new TestOrbitControls(
        engine!.camera,
        engine!.renderer!.domElement
      );

      this.controls = orbit;
      orbit.enableDamping = true;
      //   this.controls.zoomSpeed = 100;
      const camera = orbit.object as PerspectiveCamera;
      camera.far = Number.MAX_SAFE_INTEGER;
      camera.updateProjectionMatrix();

      orbit.addEventListener('change', () => {
        const distance = orbit.object.position.distanceTo(orbit.target);

        // Base zoom speed
        const baseZoomSpeed = 1;

        // Calculate dynamic zoom speed based on distance
        // Using a logarithmic scale to ensure it increases at a decreasing rate
        // Adding 1 to avoid logarithm of zero and ensure a minimum speed multiplier
        const zoomSpeedMultiplier = Math.log(distance + 1);

        // Adjust zoom speed dynamically
        orbit.zoomSpeed = baseZoomSpeed * zoomSpeedMultiplier;

        // // Increase how far the camera sees before it clips objects.
        // camera.far = distance
        // camera.updateProjectionMatrix();
      });

      engine
        ?.controller()
        .tick$.pipe(takeUntil(this.controller.onDestroy$))
        .subscribe((delta) => {
          this.controls?.update();
        });
    }, 111);
  }

  addStarField(): void {
    const starsGeometry = new BufferGeometry();
    const starsMaterial = new PointsMaterial({
      color: 'white',
      size: 100000000000000,
    });
    const starsCount = 5000; // Number of stars
    const distance = 40208000000000000n; //Number.MAX_SAFE_INTEGER * 10;

    const positions = new Float32Array(starsCount * 3); // Each star needs x, y, z coordinates

    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = Math.random() * 2 - 1; // x
      positions[i * 3 + 1] = Math.random() * 2 - 1; // y
      positions[i * 3 + 2] = Math.random() * 2 - 1; // z

      // Normalize and scale positions
      const vector = new Vector3(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      vector.normalize();
      vector.multiplyScalar(Number(distance));

      positions[i * 3] = vector.x;
      positions[i * 3 + 1] = vector.y;
      positions[i * 3 + 2] = vector.z;
    }

    starsGeometry.setAttribute(
      'position',
      new Float32BufferAttribute(positions, 3)
    );
    const stars = new Points(starsGeometry, starsMaterial);
    this.controller.scene.add(stars);
  }

  addPlanetOrbitWireFrames(): void {
    const planets = this.planets;

    planets.forEach((planet) => {
      const aX = 0; // X center of the ellipse
      const aY = 0; // Y center of the ellipse
      const xRadius = planet.orbitDiameter / 2; // X radius of the ellipse
      const yRadius = planet.orbitDiameter / 2; // Y radius of the ellipse
      const aStartAngle = 0; // Start angle in radians
      const aEndAngle = 2 * Math.PI; // End angle in radians
      const aClockwise = false; // Direction of rotation
      const aRotation = 0; // Rotation of the ellipse

      const curve = new EllipseCurve(
        aX,
        aY,
        xRadius,
        yRadius,
        aStartAngle,
        aEndAngle,
        aClockwise,
        aRotation
      );

      const points = curve.getPoints(50);
      const geometry = new BufferGeometry().setFromPoints(points);

      const material = new LineBasicMaterial({ color: planet.color });
      const curveObject = new Line(geometry, material);

      // Correctly position the orbits by setting their rotation.
      // Since the tilt is around the sun (the center of our coordinate system), we'll rotate around the X-axis.
      // Convert the orbitTilt from degrees to radians for the rotation.
      curveObject.rotation.x = MathUtils.degToRad(planet.orbitTilt);

      // Then, rotate it back to make it horizontal. This needs to be adjusted after applying the tilt.
      curveObject.rotation.x += Math.PI / 2;

      this.controller.scene.add(curveObject);
    });
  }
}

class TestOrbitControls extends OrbitControls {
  constructor(camera: Camera, domElement?: HTMLElement) {
    super(camera, domElement);
  }
}

interface ICelestialBody {
  name: string;
  orbitDiameter: number;
  physicalDiameter: number;
  color: string;
  orbitTilt: number;
  position: xyz;
  geometry: BufferGeometry;
  material: MeshStandardMaterial;
}
