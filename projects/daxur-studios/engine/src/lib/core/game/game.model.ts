import { ReplaySubject, Subject } from 'rxjs';
import { Object3D } from 'three';

export interface GameObject3D {
  id: number;
  uuid: string;
  /** Triggered when something is added to this GameObject */
  addEvent$: Subject<Object3D[]>;
  /** Triggered when something is removed from this GameObject */
  removeEvent$: Subject<Object3D[]>;
  /** Remove from parent and trigger onDestroy$ event */
  destroy(): void;
  /** Triggered when this GameObject is destroyed */
  onDestroy$: ReplaySubject<void>;
}
