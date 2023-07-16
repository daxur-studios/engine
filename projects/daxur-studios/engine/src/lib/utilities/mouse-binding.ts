/*
0: Main button pressed, usually the left button or the un-initialized state
1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
2: Secondary button pressed, usually the right button
3: Fourth button, typically the Browser Back button
4: Fifth button, typically the Browser Forward button
*/
export enum MouseButtonEnum {
  Left = 0,
  Right = 2,
  Middle = 1,
  Back = 3,
  Forward = 4,

  //   MouseMove = -1,
  MouseWheel = -2,
}
import { takeUntil } from 'rxjs';
import { Actor } from '../actors';
import { GameScene } from '../game';

export class MouseBinding {
  public button: MouseButtonEnum;
  public isPressed: boolean = false;

  private actor: Actor;

  constructor(button: MouseButtonEnum, actor: Actor) {
    this.actor = actor;
    this.button = button;

    actor.onSpawn$
      .pipe(takeUntil(actor.onDestroy$))
      .subscribe((scene) => this.spawn(scene));
  }

  private spawn(scene: GameScene) {
    const engine = scene.engine;

    engine.input.mousedown$
      .pipe(takeUntil(this.actor.onDestroy$))
      .subscribe((event) => this.onMouseDown(event));

    engine.input.mouseup$
      .pipe(takeUntil(this.actor.onDestroy$))
      .subscribe((event) => this.onMouseUp(event));
  }

  private onMouseDown(event: MouseEvent | null) {
    if (event?.button === this.button) {
      this.isPressed = true;
    }
  }

  private onMouseUp(event: MouseEvent | null) {
    if (event?.button === this.button) {
      this.isPressed = false;
    }
  }
}
