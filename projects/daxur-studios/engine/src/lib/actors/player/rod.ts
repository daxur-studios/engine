import { Group, Object3D, Vector3 } from 'three';
import { clamp, degToRad } from 'three/src/math/MathUtils';

import { Actor } from './../actor';

import { takeUntil } from 'rxjs/operators';
import { Meth, Utilities3D } from '../../utilities';
import { SaveableData } from '../../models';

/** A RodComponent is a component that can be attached to an {@link Actor}.
 * It has a parent and a socket, and the socket is attached to the parent.
 *
 * Useful for attaching a camera to a player. */
export class Rod extends Actor implements IRodComponent {
  actor: Actor;

  showDebugLine: boolean = false;

  currentRodLength: number = 5;
  targetRodLength: number = this.currentRodLength;

  rodEndGroup: Group = new Group();
  rodEndAttachmentObject: Object3D = new Object3D();

  private line = Utilities3D.line('#9c27b0', [
    new Vector3(0, 0, 0),
    new Vector3(0, 0, this.currentRodLength),
  ]);

  constructor(options: IRodComponentOptions) {
    super();

    this.rodEndAttachmentObject = options.rodEndAttachmentObject;
    this.currentRodLength = options.currentRodLength;
    this.actor = options.actor;

    //   this.actor.attachActorComponent(this);
  }

  override load(saveObject: SaveableData): void {
    super.load(saveObject);

    this.rodEndGroup.name = 'Rod End Group';
    this.group.add(this.rodEndGroup);

    this.line.name = 'Rod Debug Line';
    this.group.add(this.line);

    this.setRodEndAttachment(this.rodEndAttachmentObject);

    this.setTargetRodLength(this.targetRodLength);
    this.setCurrentRodLength(this.currentRodLength);
  }

  override tick(delta: number) {
    this.update(delta);
  }

  //#region Min/Max
  minDistance: number = 0;
  maxDistance: number = Infinity;
  //#endregion

  setCurrentRodLength(length: number) {
    length = Meth.clamp(length, this.minDistance, this.maxDistance);

    this.currentRodLength = length;
    this.line.geometry.setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(0, 0, this.currentRodLength),
    ]);

    // Push the socket to the end of the rod
    this.rodEndGroup.position.set(0, 0, this.currentRodLength);
  }
  setTargetRodLength(length: number) {
    length = Meth.clamp(length, this.minDistance, this.maxDistance);

    this.targetRodLength = length;
  }

  rotatePitch(amount: number) {
    const min = degToRad(-90);
    const max = degToRad(90);
    this.group.rotateOnAxis(new Vector3(1, 0, 0), -1 * amount * 0.01);

    this.group.rotation.x = clamp(this.group.rotation.x, min, max);
  }

  update(delta: number) {
    // Update the rod length
    if (this.currentRodLength !== this.targetRodLength) {
      const diff = this.targetRodLength - this.currentRodLength;
      this.setCurrentRodLength(this.currentRodLength + diff * 0.1);
    }
  }

  setRodEndAttachment(object: Object3D) {
    this.rodEndGroup.clear();
    this.rodEndGroup.add(object);
  }
}
interface IRodComponent {
  showDebugLine: boolean;

  currentRodLength: number;
  actor: Actor;
  rodEndGroup: Group;

  /** How far you can scroll in ( PerspectiveCamera only ).
   * @default 0
   */
  minDistance: number;
  /** How far you can scroll out ( PerspectiveCamera only ).
   * @default Infinity
   */
  maxDistance: number;

  /** Set the current length of the rod. And clamp it between the min and max distance.
   * @param length The length to set the rod to. */
  setCurrentRodLength(length: number): void;
  rotatePitch(amount: number): void;
}
interface IRodComponentOptions {
  actor: Actor;
  /** Whether to show the debug line of the rod. */
  showDebugLine: boolean;
  /** The length of the rod. */
  currentRodLength: number;

  rodEndAttachmentObject: Object3D;
}
