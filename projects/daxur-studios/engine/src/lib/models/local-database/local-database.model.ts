import Dexie from 'dexie';
import { Table } from 'dexie';

import { ILevel } from './level.model';
import { IProject } from './project.model';
import { IFolder } from './folder.model';
import { ISaveGame } from './save-game.model';
import { IAsset, IAssetPreview } from './asset.model';
import { IWidget } from './widget.model';

const databaseVersion = 1;

/** based on Indexed DB using Dexie.js */
export class DaxurEngineLocalDatabase
  extends Dexie
  implements IDaxurEngineStores
{
  projects!: Table<IProject, string>;
  levels!: Table<ILevel, string>;
  folders!: Table<IFolder, string>;

  saveGames!: Table<ISaveGame, string>;

  assetsPreview!: Table<IAssetPreview, string>;
  assets!: Table<IAsset, string>;

  widgets!: Table<IWidget, string>;

  constructor() {
    super('DaxurEngine');

    const stores: {
      [key in keyof IDaxurEngineStores]: string;
    } = {
      projects: '++name',
      levels: '++path, parent, name',
      folders: '++path, parent',
      saveGames: '++name, path, parent',
      assetsPreview: '++path, parent',
      assets: '++path, parent, size, type',
      widgets: '++path, parent',
    };

    this.version(databaseVersion).stores(stores);
  }
}

interface IDaxurEngineStores {
  projects: Table<IProject, string>;
  levels: Table<ILevel, string>;
  folders: Table<IFolder, string>;

  saveGames: Table<ISaveGame, string>;

  assetsPreview: Table<IAssetPreview, string>;
  assets: Table<IAsset, string>;

  widgets: Table<IWidget, string>;
}

// Add $ to each key
type UpdateKey<T> = {
  [K in keyof T as `$${string & K}`]: T[K];
};
