import { BufferGeometry, Material, Mesh, Object3D } from 'three';
import { GameObject3D } from './game.model';
import { ReplaySubject, Subject } from 'rxjs';

export class GameMesh<
    TGeometry extends BufferGeometry = BufferGeometry,
    TMaterial extends Material | Material[] = Material | Material[]
  >
  extends Mesh
  implements GameObject3D
{
  static count = 0;

  addEvent$ = new Subject<Object3D[]>();
  removeEvent$ = new Subject<Object3D[]>();
  onDestroy$ = new ReplaySubject<void>();

  constructor(geometry?: TGeometry, material?: TMaterial) {
    super(geometry, material);

    this.name = `GameMesh ${GameMesh.count++}`;
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

  destroy(): void {
    this.removeFromParent();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
