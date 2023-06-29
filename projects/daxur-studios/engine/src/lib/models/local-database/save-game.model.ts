import { FolderPath } from './folder.model';
import { SaveableData } from './saveable-data.model';

export interface ISaveGame<DATA = SaveableData> {
  name: string;
  path: FolderPath;
  parent: FolderPath;
  lastModified: number;
  data: DATA;
}
