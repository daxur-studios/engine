import { Object3D, Scene } from 'three';
import { ReplaySubject, Subject } from 'rxjs';
import { GameObject3D } from './game.model';
import { GameActor } from './actors/game-actor';
import type { EngineComponent } from '../../components';

export class GameScene extends Scene implements GameObject3D {
  engine: EngineComponent;

  addEvent$ = new Subject<Object3D[]>();
  removeEvent$ = new Subject<Object3D[]>();
  onDestroy$ = new ReplaySubject<void>();

  actors: Map<string, GameActor> = new Map();

  constructor(engine: EngineComponent) {
    super();
    this.engine = engine;
  }

  override add(...objects: Object3D[]): this {
    super.add(...objects);
    objects.forEach((object) => {
      if (object instanceof GameActor) {
        this.actors.set(object.uuid, object);
      }
    });
    this.addEvent$.next(objects);
    return this;
  }
  override remove(...object: Object3D[]): this {
    super.remove(...object);
    object.forEach((object) => {
      if (object instanceof GameActor) {
        this.actors.delete(object.uuid);
      }
    });
    this.removeEvent$.next(object);
    return this;
  }

  destroy(): void {
    this.removeFromParent();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
