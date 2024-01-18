import { Point } from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';

export interface IGraphOptions<T = any> {
  nodes: INode<T>[];
  inputs: IOutput[];
  outputs: IOutput[];
}

export class GraphController<T = any> {
  readonly nodes$ = new BehaviorSubject<INode<T>[]>([]);

  readonly inputs$ = new BehaviorSubject<IInput[]>([]);
  readonly outputs$ = new BehaviorSubject<IOutput[]>([]);

  get nodes() {
    return this.nodes$.value;
  }
  set nodes(value: INode<T>[]) {
    this.nodes$.next(value);
  }

  get inputs() {
    return this.inputs$.value;
  }
  set inputs(value: IInput[]) {
    this.inputs$.next(value);
  }

  get outputs() {
    return this.outputs$.value;
  }
  set outputs(value: IOutput[]) {
    this.outputs$.next(value);
  }

  constructor(options: IGraphOptions<T>) {
    this.nodes$.next(options.nodes);
    this.outputs$.next(options.outputs);
  }

  public addOutputToNode(node: INode<T>) {
    const id = this.outputs.length + 1 + '';
    this.outputs.push({
      nodeId: node.id,
      id: id,
    });
    this.outputs$.next(this.outputs);

    return id;
  }
  public addInputToNode(node: INode<T>) {
    const id = this.inputs.length + 1 + '';
    this.inputs.push({
      nodeId: node.id,
      id: id,
    });
    this.inputs$.next(this.inputs);

    return id;
  }

  public getNode(id: string): INode<T> | undefined {
    return this.nodes.find((node) => node.id === id);
  }

  public getSocket(id: string): IOutput | undefined {
    return this.outputs.find((socket) => socket.id === id);
  }
}

export interface INode<T = any> {
  id: string;
  data: T;
  position: Point;
  pendingPosition?: Point;
}

export interface IOutput {
  id: string;
  nodeId: string;
}
export interface IInput {
  id: string;
  nodeId: string;
}
