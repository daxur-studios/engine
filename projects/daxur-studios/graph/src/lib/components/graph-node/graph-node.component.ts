import {
  CdkDragEnd,
  CdkDragMove,
  DragDropModule,
  DragRef,
  Point,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { INode } from '../../models';
import { GraphService } from '../../services';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'lib-graph-node',
  standalone: true,
  imports: [DragDropModule, CommonModule, MatTooltipModule],
  templateUrl: './graph-node.component.html',
  styleUrl: './graph-node.component.scss',
})
export class GraphNodeComponent {
  @Input({ required: true }) node!: INode;

  private readonly graphService = inject(GraphService);

  //#region GraphService properties
  public get originX() {
    return this.graphService?.originX;
  }
  public get originY() {
    return this.graphService?.originY;
  }
  public get zoom() {
    return this.graphService?.zoom;
  }
  //#endregion

  constructor() {}

  dragConstrainPoint = (
    userPointerPosition: Point,
    dragRef: DragRef<INode>,
    dimensions: DOMRect,
    pickupPositionInElement: Point
  ) => {
    const zoom = this.zoom();
    const originX = this.originX();
    const originY = this.originY();

    const newPoint = { ...userPointerPosition };

    const pickupZoomedX = pickupPositionInElement.x / zoom;
    const pickupZoomedY = pickupPositionInElement.y / zoom;
    //#region
    newPoint.x -= pickupZoomedX;
    newPoint.y -= pickupZoomedY;
    //#endregion

    // Adjust based on zoom

    if (zoom > 1) {
      // move less
      newPoint.x /= zoom;
      newPoint.y /= zoom;
    } else {
      // move more
      newPoint.x /= zoom;
      newPoint.y /= zoom;
    }

    return newPoint;
  };
  nodeDragMoved(event: CdkDragMove, node: INode) {
    node.pendingPosition = event.source.getFreeDragPosition();
  }
  nodeDragEnded(event: CdkDragEnd, node: INode) {
    const zoom = this.zoom();
    const originX = this.originX();
    const originY = this.originY();

    const newPoint = { ...event.source.getFreeDragPosition() };

    event.distance;

    // //#region
    // newPoint.x -= event.source.getFreeDragPosition().x;
    // newPoint.y -= event.source.getFreeDragPosition().y;
    // //#endregion

    // // Adjust based on zoom
    // newPoint.x /= zoom;
    // newPoint.y /= zoom;

    node.position.x = event.source.getFreeDragPosition().x;
    node.position.y = event.source.getFreeDragPosition().y;

    node.pendingPosition = undefined;
  }

  nodeKeydown(event: KeyboardEvent, node: INode) {
    let amount = 1;

    if (event.shiftKey) {
      amount = 10;
    }

    switch (event.key) {
      case 'ArrowUp':
        node.position.y -= amount;
        break;
      case 'ArrowDown':
        node.position.y += amount;
        break;
      case 'ArrowLeft':
        node.position.x -= amount;
        break;
      case 'ArrowRight':
        node.position.x += amount;
        break;
    }
  }
}
