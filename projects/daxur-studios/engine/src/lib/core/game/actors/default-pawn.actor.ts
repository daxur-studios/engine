import { BoxGeometry, MeshNormalMaterial, PerspectiveCamera } from 'three';
import { SaveableData } from '../../../models';
import {
  KeyBinding,
  MouseBinding,
  MouseButtonEnum,
  MouseWheelBinding,
  MouseMovementBinding,
} from '../../utilities';

import { PlayerController } from './features';

import { GameMesh, GameActor } from '..';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EngineService } from '../../../services';

export class DefaultPawn extends GameActor {
  static override emoji = '🎥';

  public playerController?: PlayerController;

  public camera: PerspectiveCamera = new PerspectiveCamera(
    75,
    undefined,
    0.1,
    99999
  );

  public keyBindings = {
    forward: new KeyBinding('KeyW', this, {
      allowShift: true,
      allowCtrl: true,
    }),
    back: new KeyBinding('KeyS', this, { allowShift: true, allowCtrl: true }),
    left: new KeyBinding('KeyA', this, { allowShift: true, allowCtrl: true }),
    right: new KeyBinding('KeyD', this, { allowShift: true, allowCtrl: true }),
    up: new KeyBinding('KeyE', this, { allowShift: true, allowCtrl: true }),
    down: new KeyBinding('KeyQ', this, { allowShift: true, allowCtrl: true }),
  };

  public mouseBindings = {
    look: new MouseBinding(MouseButtonEnum.Right, this),
    zoom: new MouseWheelBinding(this),
    mouseMove: new MouseMovementBinding(this),
  };

  public movementSpeed: number = 1;
  public movementVelocities = {
    right: 0, // right
    forward: 0, // forward
    up: 0,
  };

  constructor() {
    super();
  }

  override load(saveObject: SaveableData) {
    this.clear();

    const mesh = new GameMesh(
      new BoxGeometry(1, 1, 1),
      new MeshNormalMaterial()
    );
    this.add(mesh);
    mesh.position.set(2, 1, 3);

    this.playerController = new PlayerController({
      key: 'playerController',
      camera: this.camera,
      autoPossessPlayer: true,
      actor: this,
    });
    this.add(this.playerController.rod.group);
  }

  override onBeginPlay() {
    super.onBeginPlay();
  }

  override tick(delta: number) {
    super.tick(delta);

    this.handleInput(delta);
  }

  private handleInput(delta: number) {
    if (!this.isPlaying()) {
      return;
    }

    if (this.keyBindings.forward.isPressed) {
      this.movementVelocities.forward = this.movementSpeed;
    } else if (this.keyBindings.back.isPressed) {
      this.movementVelocities.forward = -this.movementSpeed;
    } else {
      this.movementVelocities.forward = 0;
    }

    if (this.keyBindings.right.isPressed) {
      this.movementVelocities.right = this.movementSpeed;
    } else if (this.keyBindings.left.isPressed) {
      this.movementVelocities.right = -this.movementSpeed;
    } else {
      this.movementVelocities.right = 0;
    }

    if (this.keyBindings.up.isPressed) {
      this.movementVelocities.up = this.movementSpeed;
    } else if (this.keyBindings.down.isPressed) {
      this.movementVelocities.up = -this.movementSpeed;
    } else {
      this.movementVelocities.up = 0;
    }

    this.translateX(this.movementVelocities.right * delta);
    this.translateY(this.movementVelocities.forward * delta);
    this.translateZ(this.movementVelocities.up * delta);

    //#region Mouse Look
    if (this.mouseBindings.look.isPressed) {
      this.rotateY(this.mouseBindings.mouseMove.x * delta * -1);
      if (this.playerController?.rod?.group) {
        this.playerController.rod.group.rotateX(
          this.mouseBindings.mouseMove.y * delta * -1
        );
      }
    }
    //#endregion

    //#region Mouse Zoom
    if (this.mouseBindings.zoom.deltaY) {
      this.playerController?.rod?.setTargetRodLength(
        this.playerController.rod?.targetRodLength! +
          this.mouseBindings.zoom.deltaY * delta
      );
    }
    //#endregion
  }
}

@Component({
  selector: 'default-pawn',
  standalone: true,
  imports: [],
  template: '',
})
export class DefaultPawnComponent implements OnInit, OnDestroy {
  readonly actor = new DefaultPawn();

  constructor(readonly engineService: EngineService) {}
  ngOnDestroy(): void {
    this.actor.destroy();
  }
  ngOnInit(): void {
    this.engineService.spawnActor(this.actor);
  }
}
