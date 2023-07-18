import { Group } from 'three';
import { GameObject3D } from './game.model';
import { ReplaySubject, Subject } from 'rxjs';
import { Object3D } from 'three';

export class GameGroup extends Group implements GameObject3D {
  static count = 0;

  addEvent$ = new Subject<Object3D[]>();
  removeEvent$ = new Subject<Object3D[]>();
  onDestroy$: ReplaySubject<void> = new ReplaySubject<void>();

  constructor() {
    super();

    this.name = `GameGroup ${GameGroup.count++}`;
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

  override removeFromParent(): this {
    super.removeFromParent();

    //...

    return this;
  }

  destroy(): void {
    this.removeFromParent();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

export interface IGameGroup extends GameObject3D {
  add(...object: Object3D[]): this;
  remove(...object: Object3D[]): this;
  removeFromParent(): this;
  destroy(): void;

  addEvent$: Subject<Object3D[]>;
  removeEvent$: Subject<Object3D[]>;
  onDestroy$: ReplaySubject<void>;
}
