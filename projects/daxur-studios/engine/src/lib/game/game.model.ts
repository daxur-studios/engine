import { Subject } from 'rxjs';
import { Object3D } from 'three';

export interface GameObject3D {
  addEvent$: Subject<Object3D[]>;
  removeEvent$: Subject<Object3D[]>;
}
