import { takeUntil } from 'rxjs';
import { GameScene } from '../game';
import { inject } from '@angular/core';
import { InputService } from '../services';
import { Actor } from '../actors';

export class MouseMovementBinding {
  public x: number = 0;
  public y: number = 0;

  private actor: Actor;

  private _timeoutCheck: any = null;

  constructor(actor: Actor) {
    this.actor = actor;

    actor.onSpawn$
      .pipe(takeUntil(actor.onDestroy$))
      .subscribe((scene) => this.spawn(scene));
  }

  private spawn(scene: GameScene) {
    const engine = scene.engine;

    engine.input.mousemove$
      .pipe(takeUntil(this.actor.onDestroy$))
      .subscribe((event) => this.onMouseMove(event));
  }

  private onMouseMove(event: MouseEvent | null) {
    this.x = event?.movementX ?? 0;
    this.y = event?.movementY ?? 0;

    if (this._timeoutCheck) {
      clearTimeout(this._timeoutCheck);
    }

    this._timeoutCheck = setTimeout(() => {
      this.x = 0;
      this.y = 0;
    }, 50);
  }
}
