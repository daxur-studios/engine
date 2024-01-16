import {
  CdkDragEnd,
  CdkDragMove,
  DragDropModule,
  DragRef,
  Point,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
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

  @ViewChild('nodeElement', { static: true })
  nodeElement?: ElementRef<HTMLDivElement>;

  private readonly graphService = inject(GraphService);

  //#region GraphService properties
  public get originX() {
    return this.graphService?.originX;
  }
  public get originY() {
    return this.graphService?.originY;
  }
  public get scale() {
    return this.graphService?.scale;
  }
  //#endregion

  constructor() {}

  dragConstrainPoint = (
    userPointerPosition: Point,
    dragRef: DragRef<INode>,
    dimensions: DOMRect,
    pickupPositionInElement: Point
  ) => {
    const scale = this.scale(); // Ensure this correctly retrieves the current scale factor

    const newPoint = { ...userPointerPosition };

    // Adjusting for the pickup position
    newPoint.x -= pickupPositionInElement.x;
    newPoint.y -= pickupPositionInElement.y;

    // Adjusting for scale
    // The idea is to scale the difference between the original and the new position
    // This ensures that the element moves in sync with the cursor
    newPoint.x = (newPoint.x - dimensions.left) / scale + dimensions.left;
    newPoint.y = (newPoint.y - dimensions.top) / scale + dimensions.top;

    return newPoint;
  };

  nodeDragMoved(event: CdkDragMove, node: INode) {
    node.pendingPosition = event.source.getFreeDragPosition();
  }
  nodeDragEnded(event: CdkDragEnd, node: INode) {
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

      case 'Escape':
        // Lose focus
        const target = event.target as HTMLElement;
        target?.blur();

        this.graphService.component?.graphDragBox?.nativeElement.focus();

        break;
    }

    event.stopPropagation();
  }
}
