import { IActor } from './actor.model';
import { FolderPath } from './folder.model';
import { SaveableData } from './saveable-data.model';

/**
 * Store information about a level, used to load a level before the game starts
 */
export interface ILevel<DATA = SaveableData> {
  path: FolderPath;
  parent: FolderPath;
  lastModified: number;

  /**
   * The name of the level
   * @example 'Level 1'
   */
  name: string;

  /**
   * The thumbnail of the asset
   */
  thumbnail?: ArrayBuffer;

  data: DATA;

  actors: IActor[] | undefined;

  assetsPaths: FolderPath[];
  materialPaths: FolderPath[];
  texturePaths: FolderPath[];
}
