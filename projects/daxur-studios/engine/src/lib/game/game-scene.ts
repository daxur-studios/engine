import { Object3D, Scene } from 'three';
import type { EngineComponent } from '../components';
import { Subject } from 'rxjs';
import { GameObject3D } from './game.model';

export class GameScene extends Scene implements GameObject3D {
  engine: EngineComponent;

  addEvent$ = new Subject<Object3D[]>();
  removeEvent$ = new Subject<Object3D[]>();

  constructor(engine: EngineComponent) {
    super();
    this.engine = engine;
  }

  override add(...object: Object3D[]): this {
    super.add(...object);
    this.addEvent$.next(object);
    return this;
  }
  override remove(...object: Object3D[]): this {
    super.remove(...object);
    this.removeEvent$.next(object);
    return this;
  }
}
