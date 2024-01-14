import { Point } from '@angular/cdk/drag-drop';

export interface IGraphOptions<T = any> {
  nodes: INode<T>[];
}

export interface INode<T = any> {
  id: string;
  data: T;
  position: Point;
  pendingPosition?: Point;
  edges: IEdge[];
}

export interface IEdge {
  id: string;
  from: string;
  to: string;
}
