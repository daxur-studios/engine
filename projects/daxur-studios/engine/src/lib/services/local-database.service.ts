import { Injectable } from '@angular/core';

import { DaxurEngineLocalDatabase } from '../models/local-database/local-database.model';
import {
  IAsset,
  IAssetPreview,
  IFolder,
  ILevel,
  IProject,
  ISaveGame,
  IWidget,
} from '../models';
import { Table } from 'dexie';

@Injectable({
  providedIn: 'root',
})
export class LocalDatabaseService {
  database = new DaxurEngineLocalDatabase();

  //#region Table Getters
  get projects(): Table<IProject, string> {
    return this.database.projects;
  }
  get levels(): Table<ILevel, string> {
    return this.database.levels;
  }
  get folders(): Table<IFolder, string> {
    return this.database.folders;
  }
  get saveGames(): Table<ISaveGame, string> {
    return this.database.saveGames;
  }
  get assets(): Table<IAsset, string> {
    return this.database.assets;
  }
  get assetsPreview(): Table<IAssetPreview, string> {
    return this.database.assetsPreview;
  }
  get widgets(): Table<IWidget, string> {
    return this.database.widgets;
  }
  //#endregion

  constructor() {
    if (!this.isStoragePersisted()) {
      this.requestStoragePersist();
    }
  }

  /**
   * Use this wisely, as ObjectURLs are not automatically cleaned up.
   */
  static getObjectURLForBlob(data: Blob | undefined | null, type: string) {
    if (!data) {
      return null;
    }
    const url = URL.createObjectURL(data);
    return url;
  }

  static revokeObjectURL(url: string) {
    URL.revokeObjectURL(url);
  }

  //#region Storage Persistance
  /** Asks the user for permission to persist data to disk.*/
  private requestStoragePersist() {
    return (
      navigator.storage &&
      navigator.storage.persist &&
      navigator.storage.persist()
    );
  }
  /** Returns a promise that resolves to a boolean indicating whether the storage is persisted */
  isStoragePersisted() {
    return navigator.storage && navigator.storage.persisted
      ? navigator.storage.persisted()
      : undefined;
  }
  //#endregion
}
