export interface IGraphOptions<T = any> {
  nodes: INode<T>[];
}

export interface INode<T = any> {
  id: string;
  data: T;
  position: IPosition;
  edges: IEdge[];
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IEdge {
  id: string;
  from: string;
  to: string;
}
