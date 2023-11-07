import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineComponent } from '..';
import { IEngineOptions } from '../../models/engine.model';
import {
  BoxGeometry,
  Color,
  DirectionalLight,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { LoaderService } from '../../services';

@Component({
  selector: 'daxur-mesh-viewer',
  standalone: true,
  imports: [CommonModule, EngineComponent],
  templateUrl: './mesh-viewer.component.html',
  styleUrls: ['./mesh-viewer.component.css'],
})
export class MeshViewerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) options?: IEngineOptions;

  /**
   * Path to the STL or GLB file to load
   */
  @Input() path?: string;

  @ViewChild(EngineComponent, { static: true }) engine?: EngineComponent;

  controls?: OrbitControls;
  vrButton?: HTMLElement;

  constructor(private readonly loaderService: LoaderService) {}

  ngOnInit(): void {
    //#region Scene Setup
    const gridHelper = new GridHelper(10, 10);
    this.engine?.scene.add(gridHelper);

    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    // make light come in at an angle
    directionalLight.lookAt(0, 0, 0);

    this.engine?.scene.add(directionalLight);

    const cube = new Mesh(
      new BoxGeometry(0.3, 0.3, 0.3),
      new MeshBasicMaterial({ color: 0xff0000 })
    );
    this.engine?.scene.add(cube);
    this.engine?.camera.position.set(0, 0, 5);

    setTimeout(() => {
      this.controls = new OrbitControls(
        this.engine!.camera,
        this.engine?.renderer.domElement
      );
      this.controls.enableDamping = true;

      this.engine?.tick$.subscribe((delta) => {
        this.controls?.update();

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.01;
      });
    }, 1);

    //#region VR
    const renderer = this.engine!.renderer;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local');
    this.engine!.mode = 'VR';

    // Add VRButton to the DOM and set up WebXR
    const vrButton = VRButton.createButton(renderer);
    document.body.appendChild(vrButton);
    this.vrButton = vrButton;
    //#endregion

    this.load();
  }

  ngOnDestroy(): void {
    this.vrButton?.remove();
  }

  private load() {
    const type = this.path?.split('.').pop()?.toLowerCase();

    if (type === 'stl') {
      this.loadSTL();
    } else if (type === 'glb' || type === 'gltf') {
      this.loadGLTF();
    }
  }

  private loadSTL() {
    if (this.path) {
      const loader = this.loaderService.stlLoader;
      loader.load(this.path, (geometry) => {
        const material = new MeshStandardMaterial({ color: 0xff0000 });
        const mesh = new Mesh(geometry, material);
        this.engine?.scene.add(mesh);
      });
    }
  }

  private loadGLTF() {
    if (this.path) {
      const loader = this.loaderService.gltfLoader;
      loader.load(this.path, (gltf) => {
        const model = gltf.scene;
        this.engine?.scene.add(model);
      });
    }
  }
}
