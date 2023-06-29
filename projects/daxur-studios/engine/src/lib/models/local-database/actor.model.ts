import { SaveableData } from './saveable-data.model';

export interface IActor {
  className: string;
  saveObject: SaveableData;
}
