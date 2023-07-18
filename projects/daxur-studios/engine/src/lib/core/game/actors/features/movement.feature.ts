import { Vector3 } from 'three';
import { Feature, IFeatureOptions } from './feature';

import type { GameActor } from '../..';

export class MovementFeature extends Feature implements IMovementFeature {
  movementSpeed: number = 1;

  constructor(options: IMovementFeatureOptions) {
    super(options);

    this.actor = options.actor;
  }

  addMovementInput(worldDirection: Vector3, scale: number): void {
    // add movement based on input, and engine delta time
    this.actor.position.addScaledVector(
      worldDirection,
      scale * this.movementSpeed
    );
  }
}

interface IMovementFeature {
  actor: GameActor;
  movementSpeed: number;
  addMovementInput(worldDirection: Vector3, scale: number): void;
}

interface IMovementFeatureOptions extends IFeatureOptions {
  movementSpeed?: number;
}
