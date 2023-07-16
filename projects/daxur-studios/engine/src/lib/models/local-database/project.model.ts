export interface IProject {
  name: string;
  description: string;
  thumbnail?: ArrayBuffer;
  lastModified: number;

  /**
   * The path of the last opened folder,
   * this folder is opened when the project is loaded
   */
  lastPath?: string;
}

/** A group of projects*/
export interface IProjectGroup {
  /**Name of the Project Group */
  name: string;
  projects: IProject[];
}
