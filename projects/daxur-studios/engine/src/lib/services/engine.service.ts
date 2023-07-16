import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class EngineService {
  //#region Sizes
  public width$ = new BehaviorSubject<number>(1);
  public height$ = new BehaviorSubject<number>(1);
  public get width() {
    return this.width$.value;
  }
  public get height() {
    return this.height$.value;
  }
  public resize = new EventEmitter<{ width: number; height: number }>();
  //#endregion

  constructor() {}
}
