export interface IAssetPreview {
  name: string;
  path: string;
  parent: string;

  size: number;
  type: string;
  lastModified: number;

  /**
   * The thumbnail preview of the asset
   * For example, used to display the asset in search results
   */
  thumbnail?: ArrayBuffer;
}
export interface IAsset extends IAssetPreview {
  /** Raw Data Containing the Asset */
  blob: Blob;
}
