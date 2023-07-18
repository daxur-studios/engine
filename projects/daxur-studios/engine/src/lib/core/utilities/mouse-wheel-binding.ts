import { takeUntil } from 'rxjs';
import type { EngineComponent } from '../../components';
import { GameActor } from '../game';

export class MouseWheelBinding {
  public deltaY: number = 0;

  private actor: GameActor;

  private _timeoutCheck: any = null;

  constructor(actor: GameActor) {
    this.actor = actor;

    actor.onSpawn$
      .pipe(takeUntil(actor.onDestroy$))
      .subscribe((scene) => this.spawn(scene));
  }

  private spawn(engine: EngineComponent) {
    engine.input.mousewheel$
      .pipe(takeUntil(this.actor.onDestroy$))
      .subscribe((event) => this.onWheel(event));
  }

  private onWheel(event: Event | WheelEvent | MouseEvent | null) {
    if (event instanceof WheelEvent) {
      this.deltaY = event.deltaY;
    } else {
      this.deltaY = 0;
    }

    if (this._timeoutCheck) {
      clearTimeout(this._timeoutCheck);
    }

    this._timeoutCheck = setTimeout(() => {
      this.deltaY = 0;
    }, 50);
  }
}
