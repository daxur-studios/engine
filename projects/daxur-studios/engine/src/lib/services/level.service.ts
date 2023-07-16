import { Injectable } from '@angular/core';
import { ILevel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LevelService {
  constructor() {}

  setActiveLevel(level: ILevel | null) {}
}
