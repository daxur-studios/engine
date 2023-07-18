import { takeUntil } from 'rxjs';
import type { EngineComponent } from '../../components';
import { GameActor } from '../game';

export class KeyBinding {
  public eventCodes: string[];
  public isPressed: boolean = false;

  public allowShift: boolean = false;
  public allowCtrl: boolean = false;
  public allowAlt: boolean = false;

  private actor: GameActor;

  constructor(
    code: string | string[],
    actor: GameActor,
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
      .subscribe((engine) => this.spawn(engine));
  }

  private spawn(engine: EngineComponent) {
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
