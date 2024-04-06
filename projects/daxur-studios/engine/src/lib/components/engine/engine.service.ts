import { Injectable } from '@angular/core';
import { GameScene } from '../../core';

@Injectable()
export class EngineService {
  static instance = 0;
  readonly instance: number;

  readonly scene = new GameScene();

  constructor() {
    EngineService.instance++;
    this.instance = EngineService.instance;

    console.debug('EngineService created, instance: ', this.instance);
  }
}
