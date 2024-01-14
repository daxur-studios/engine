import { Injectable, signal } from '@angular/core';

@Injectable()
export class GraphService {
  //#region Signals
  readonly scale = signal(1);

  readonly originX = signal(0);
  readonly originY = signal(0);

  readonly width = signal(0);
  readonly height = signal(0);
  //#endregion

  constructor() {}
}
