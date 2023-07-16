import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera } from 'three';
import { takeUntil } from 'rxjs/operators';
import { SaveableData } from '../models';
import { KeyBinding, MouseBinding, MouseButtonEnum } from '../utilities';
import { Actor } from './actor';
import { GameMesh } from '../game';
import { PlayerController } from './player';
import { Injector } from '@angular/core';
import { MouseWheelBinding } from '../utilities/mouse-wheel-binding';
import { MouseMovementBinding } from '../utilities/mouse-movement-binding';

export class DefaultPawn extends Actor {
  override childActors = {
    playerController: <PlayerController | null>null,
  };

  // public playerController: PlayerController;
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
    this.childActors.playerController = new PlayerController({
      camera: this.camera,
      autoPossessPlayer: true,
    });
  }

  override load(saveObject: SaveableData) {
    this.group.clear();

    const mesh = new GameMesh(
      new BoxGeometry(1, 1, 1),
      new MeshBasicMaterial({ color: 0x00ff00 })
    );
    this.group.add(mesh);

    mesh.position.set(2, 1, 3);
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

    this.group.translateX(this.movementVelocities.right * delta);
    this.group.translateY(this.movementVelocities.forward * delta);
    this.group.translateZ(this.movementVelocities.up * delta);

    //#region Mouse Look
    if (this.mouseBindings.look.isPressed) {
      this.group.rotateY(this.mouseBindings.mouseMove.x * delta);
      //this.group.rotateX(this.mouseBindings.look.axisY * delta);
    }
    //#endregion

    //#region Mouse Zoom
    if (this.mouseBindings.zoom.deltaY) {
      this.childActors.playerController?.childActors.rod?.setTargetRodLength(
        this.childActors.playerController?.childActors.rod?.targetRodLength! +
          this.mouseBindings.zoom.deltaY * delta
      );
    }
    //#endregion
  }
}
