import { Camera, PerspectiveCamera } from 'three';
import { Actor } from '../actor';
import { Rod } from './rod';
import { SaveableData } from '../../models';
import { GameScene } from '../../game';

export class PlayerController extends Actor {
  camera: Camera;

  override childActors = {
    rod: <Rod | null>null,
  };

  private _mode: PlayerControllerMode = 'Third Person';

  constructor(options: IPlayerControllerOptions) {
    super();

    this.camera = options.camera;
  }

  override load(saveObject: SaveableData): void {
    super.load(saveObject);

    if (this.childActors.rod) {
      this.childActors.rod.destroy();
    }

    this.childActors.rod = new Rod({
      actor: this,
      currentRodLength: 5,
      rodEndAttachmentObject: this.camera,
      showDebugLine: true,
    });
    this.childActors.rod.load({});

    this.group.add(this.childActors.rod.group);
  }

  override spawn(scene: GameScene): void {
    super.spawn(scene);
  }

  switchEngineCamera() {
    if (this.engine) {
      this.engine.switchCamera(this.camera);
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
      this.childActors.rod?.setTargetRodLength(0);
    } else if (mode === 'Third Person') {
      this.childActors.rod?.setTargetRodLength(5);
    }
  }

  attachToActor(actor: Actor) {}

  detachFromActor(actor: Actor) {}
}

export type PlayerControllerMode = 'First Person' | 'Third Person';

export interface IPlayerControllerOptions {
  camera: Camera;
  autoPossessPlayer?: boolean;
}
