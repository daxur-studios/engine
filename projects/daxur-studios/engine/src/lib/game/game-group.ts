import { Group } from 'three';
import { GameObject3D } from './game.model';
import { Subject } from 'rxjs';
import { Object3D } from 'three';

export class GameGroup extends Group implements GameObject3D {
  addEvent$ = new Subject<Object3D[]>();
  removeEvent$ = new Subject<Object3D[]>();

  constructor() {
    super();
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
