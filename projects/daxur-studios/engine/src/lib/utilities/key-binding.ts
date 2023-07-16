import type { Actor } from '../actors';
import { takeUntil } from 'rxjs';
import { GameScene } from '../game';
import { inject } from '@angular/core';
import { InputService } from '../services';

export class KeyBinding {
  public eventCodes: string[];
  public isPressed: boolean = false;

  public allowShift: boolean = false;
  public allowCtrl: boolean = false;
  public allowAlt: boolean = false;

  private actor: Actor;

  constructor(
    code: string | string[],
    actor: Actor,
    options?: IKeyBindingOptions
  ) {
    this.actor = actor;

    if (typeof code === 'string') {
      code = [code];
    }
    this.eventCodes = code;

    if (options) {
      this.allowShift = options.allowShift ?? false;
      this.allowCtrl = options.allowCtrl ?? false;
      this.allowAlt = options.allowAlt ?? false;
    }

    actor.onSpawn$
      .pipe(takeUntil(actor.onDestroy$))
      .subscribe((scene) => this.spawn(scene));
  }

  private spawn(scene: GameScene) {
    const engine = scene.engine;

    engine.input.keyup$
      .pipe(takeUntil(this.actor.onDestroy$))
      .subscribe((event) => this.onKeyUp(event));

    engine.input.keydown$
      .pipe(takeUntil(this.actor.onDestroy$))
      .subscribe((event) => this.onKeyDown(event));
  }

  private onKeyUp(event: KeyboardEvent | null) {
    if (event && this.eventCodes.includes(event.code)) {
      this.isPressed = false;
    }
  }

  private onKeyDown(event: KeyboardEvent | null) {
    if (event && this.eventCodes.includes(event.code)) {
      this.isPressed = true;
    }
  }
}

interface IKeyBindingOptions {
  allowShift?: boolean;
  allowCtrl?: boolean;
  allowAlt?: boolean;
}
