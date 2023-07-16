/**
 * This module contains all the models that are used in the local database
 */
export namespace LocalDatabase {
  export type DaxurEngine =
    import('./local-database.model').DaxurEngineLocalDatabase;

  export type SaveAbleData = import('./saveable-data.model').SaveableData;

  export type IProject = import('./project.model').IProject;
  export type ILevel = import('./level.model').ILevel;
  export type IFolder = import('./folder.model').IFolder;
  export type ISaveGame = import('./save-game.model').ISaveGame;
  export type IAssetPreview = import('./asset.model').IAssetPreview;
  export type IAsset = import('./asset.model').IAsset;
  export type IActor = import('./actor.model').IActor;
  export type IWidget = import('./widget.model').IWidget;
}
