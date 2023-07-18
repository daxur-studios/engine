import { takeUntil } from 'rxjs';
import { Camera } from 'three';
import { Rod } from './rod.feature';
import { Feature, IFeatureOptions } from './feature';
import type { GameActor } from '../..';

export class PlayerController extends Feature {
  camera: Camera;
  rod: Rod;

  autoPossessPlayer: boolean = false;
  private _mode: PlayerControllerMode = 'Third Person';

  constructor(options: IPlayerControllerOptions) {
    super(options);

    this.actor = options.actor;

    this.autoPossessPlayer = options.autoPossessPlayer ?? false;

    this.camera = options.camera;

    this.rod = new Rod({
      key: 'rod',
      actor: this.actor,
      currentRodLength: 5,
      rodEndAttachmentObject: this.camera,
      showDebugLine: true,
    });

    this.actor.add(this.rod.group);

    this.actor.onSpawn$
      .pipe(takeUntil(this.actor.onDestroy$))
      .subscribe((scene) => {
        if (this.autoPossessPlayer) {
          this.switchEngineCamera();
        }
      });
  }

  /** Switch engine camera to this Player Controller's camera  */
  switchEngineCamera() {
    if (this.actor.engine) {
      this, this.actor.engine.switchCamera(this.camera);
    } else {
      console.error(
        'No engine attached to PlayerController, cannot switch camera.'
      );
    }
  }

  get mode() {
    return this._mode;
  }
  set mode(value) {
    if (this._mode !== value) {
      this.setMode(value);
    }
  }

  setMode(mode: PlayerControllerMode) {
    this._mode = mode;

    if (mode === 'First Person') {
      this.rod?.setTargetRodLength(0);
    } else if (mode === 'Third Person') {
      this.rod?.setTargetRodLength(5);
    }
  }

  attachToActor(actor: GameActor) {}

  detachFromActor(actor: GameActor) {}
}

export type PlayerControllerMode = 'First Person' | 'Third Person';

export interface IPlayerControllerOptions extends IFeatureOptions {
  camera: Camera;
  autoPossessPlayer?: boolean;
  actor: GameActor;
}
