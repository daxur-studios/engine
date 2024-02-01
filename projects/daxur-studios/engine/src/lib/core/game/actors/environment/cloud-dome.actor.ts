import {
  MeshBasicMaterial,
  PlaneGeometry,
  RingGeometry,
  SphereGeometry,
  Vector3,
} from 'three';
import { degToRad } from 'three/src/math/MathUtils';

import type { EngineComponent } from '../../../../components';
import { IEngine, SaveableData } from '../../../../models';
import { Field, Utilities3D } from '../../../utilities';
import { GameMesh } from '../../game-mesh';
import { GameActor } from '../game-actor';

export class CloudDome extends GameActor {
  static override emoji = '☁️';

  sprite = {
    path: './assets/daxur-engine/starter-content/actors/cloud dome icon min.png',
  };

  //override GameGroup: GameGroup = super.GameGroup;

  numberOfRingsField = new Field(this, 'numberOfRings');
  numberOfRings: number = 3;

  numberOfCloudsPerRingField = new Field(this, 'numberOfCloudsPerRing');
  numberOfCloudsPerRing: number = 5;

  constructor() {
    super();
  }

  override spawn(engine: IEngine) {
    super.spawn(engine);

    engine.tick$.subscribe(() => {
      this.children.forEach((ring, index) => {
        ring.rotateZ(degToRad(0.01 * (index % 2 === 0 ? 1 : -1)));
        // Utilities3D.rotateAroundVectorAndAxis(
        //   ring,
        //   new Vector3(0, 0, 0),
        //   new Vector3(0, 0, 1),
        //   degToRad(0.01)
        // );
      });
    });
  }

  generateClouds() {
    const cloudMaterial = new MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    });

    const ringMaterial = new MeshBasicMaterial({
      color: '#298dff',
      wireframe: true,
      wireframeLinewidth: 0.1,
      opacity: 0.2,
    });

    this.clear();

    // Create Rings
    for (let i = 0; i < this.numberOfRings; i++) {
      const b = 99 - i;

      const ring = new RingGeometry(b, b, 32);
      const ringMesh = new GameMesh(ring, ringMaterial);
      ringMesh.name = `Ring ${i}`;
      ringMesh.position.set(0, i * 3 + 2, 0);
      ringMesh.rotation.set(Math.PI / 2, 0, 0);

      this.add(ringMesh);

      // Create Clouds
      for (let j = 0; j < this.numberOfCloudsPerRing; j++) {
        const plane = new PlaneGeometry(1, 1, 1, 1);

        const cloud = new GameMesh(
          new SphereGeometry(1, 32, 32),
          cloudMaterial
        );
        ringMesh.add(cloud);
        cloud.position.set(b, 0, 0);
        cloud.name = `Cloud ${i} ${j}`;

        // cloud,
        // ringMesh.position,
        // new Vector3(0, 0, 1),
        // degToRad(30 * j),

        const random = Math.random() * (360 / this.numberOfCloudsPerRing);

        Utilities3D.rotateAroundVectorAndAxis(
          cloud,
          new Vector3(0, 0, 0),
          new Vector3(0, 0, 1),
          degToRad((360 / this.numberOfCloudsPerRing) * j + random)
        );
      }
    }

    // for (let i = 0; i < this.numberOfRings; i++) {
    //   // add a cube to represent the cloud
    //   const cloud = new GameMesh(DaxurGeometries.sphere(1, 32, 32), cloudMaterial);
    //   cloud.name = `Cloud ${i}`;
    //   cloud.position.set(i + 1, i + 1, i + 1);
    //   this.GameGroup.add(cloud);
    // }
  }

  override save(): SaveableData {
    const x: SaveableData = {
      // ...super.save(),
      data: {
        numberOfRings: this.numberOfRings,
        numberOfCloudsPerRing: this.numberOfCloudsPerRing,
      },
    };

    return x;
  }

  override load(saveObject: SaveableData) {
    super.load(saveObject);

    //this.numberOfRings = saveObject.data.numberOfRings!;
    /// this.numberOfCloudsPerRing = saveObject.data.numberOfCloudsPerRing!;

    this.generateClouds();
  }
}

const cloudImages = [
  'assets/starter-content/environment/clouds/cloud2-min.png',
  'assets/starter-content/environment/clouds/cloud4-min.png',
];
