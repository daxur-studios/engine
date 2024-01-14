import { Injectable, signal } from '@angular/core';
import { INode } from '../models';
import { Point } from '@angular/cdk/drag-drop';

@Injectable()
export class GraphService {
  //#region Signals
  readonly scale = signal(1);

  readonly originX = signal(0);
  readonly originY = signal(0);

  readonly width = signal(0);
  readonly height = signal(0);
  //#endregion

  constructor() {}

  public goToNode(node: INode) {
    const width = this.width();
    const height = this.height();
    const x = width / 2 - node.position.x;
    const y = height / 2 - node.position.y;
    this.setPosition({ x, y });
  }

  public setPosition(point: Point) {
    this.originX.set(point.x);
    this.originY.set(point.y);
  }
}
