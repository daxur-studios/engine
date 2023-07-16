import { BufferGeometry, Material, Mesh, Object3D } from 'three';
import { GameObject3D } from './game.model';
import { Subject } from 'rxjs';

export class GameMesh<
    TGeometry extends BufferGeometry = BufferGeometry,
    TMaterial extends Material | Material[] = Material | Material[]
  >
  extends Mesh
  implements GameObject3D
{
  addEvent$ = new Subject<Object3D[]>();
  removeEvent$ = new Subject<Object3D[]>();

  constructor(geometry?: TGeometry, material?: TMaterial) {
    super(geometry, material);
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
