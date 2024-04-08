// test.component.ts (modified for service access)
import { Injectable } from '@angular/core';
import { Object3DService } from '@daxur-studios/engine';

@Injectable()
export class MeshService {
  isMeshService = true;

  material: any;
  geometry: any;

  constructor(public readonly object3DService: Object3DService) {}
}
