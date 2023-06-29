import { FolderPath } from './folder.model';

export interface IWidget {
  path: FolderPath;
  parent: FolderPath;
  name: string;

  width: string;
  height: string;
}
