import { Injectable } from '@angular/core';
import {
  AudioLoader,
  BufferGeometryLoader,
  ObjectLoader,
  TextureLoader,
} from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  textureLoader = new TextureLoader();
  bufferGeometryLoader = new BufferGeometryLoader();
  objectLoader = new ObjectLoader();
  svgLoader = new SVGLoader();
  gltfExporter = new GLTFExporter();
  audioLoader = new AudioLoader();

  gltfLoader = new GLTFLoader();
  dracoLoader: DRACOLoader = new DRACOLoader();
  stlLoader = new STLLoader();

  constructor() {
    this.dracoLoader.setDecoderPath('/assets/daxur-engine/draco/'); // use Web Assembly version
    this.dracoLoader.preload();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }
}
