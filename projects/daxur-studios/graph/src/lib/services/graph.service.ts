import { Injectable, signal } from '@angular/core';

@Injectable()
export class GraphService {
  //#region Signals
  readonly zoom = signal(1);

  readonly originX = signal(0);
  readonly originY = signal(0);
  //#endregion

  constructor() {}
}
