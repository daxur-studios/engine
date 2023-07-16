import { takeUntil } from 'rxjs';
import { Actor } from '../actors';
import { GameScene } from '../game';

export class MouseWheelBinding {
  public deltaY: number = 0;

  private actor: Actor;

  constructor(actor: Actor) {
    this.actor = actor;

    actor.onSpawn$
      .pipe(takeUntil(actor.onDestroy$))
      .subscribe((scene) => this.spawn(scene));
  }

  private spawn(scene: GameScene) {
    const engine = scene.engine;

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
  }
}
