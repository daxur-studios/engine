import { Point } from '@angular/cdk/drag-drop';
import { Injectable, signal } from '@angular/core';
import { GraphCamera, INode } from '../models';
import type { GraphComponent } from '../components';

@Injectable()
export class GraphService {
  readonly camera = new GraphCamera();
  component?: GraphComponent;

  //#region Signals
  readonly scale = this.camera.scale;

  readonly originX = this.camera.originX;
  readonly originY = this.camera.originY;

  readonly width = this.camera.baseWidth;
  readonly height = this.camera.baseHeight;
  //#endregion

  constructor() {}

  public goToNode(node: INode) {
    this.setCameraPosition(node.position);
    this.component?.focusNode(node);
  }

  public setCameraPosition(point: Point) {
    this.camera.setCameraPosition(point);
  }
}
