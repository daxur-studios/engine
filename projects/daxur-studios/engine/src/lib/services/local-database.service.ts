import { Injectable } from '@angular/core';

import { DaxurEngineLocalDatabase } from '../models/local-database/local-database.model';

@Injectable({
  providedIn: 'root',
})
export class LocalDatabaseService {
  database = new DaxurEngineLocalDatabase();

  //#region Table Getters
  get projects() {
    return this.database.projects;
  }
  get levels() {
    return this.database.levels;
  }
  get folders() {
    return this.database.folders;
  }
  get saveGames() {
    return this.database.saveGames;
  }
  get assets() {
    return this.database.assets;
  }
  get assetsPreview() {
    return this.database.assetsPreview;
  }
  get widgets() {
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
