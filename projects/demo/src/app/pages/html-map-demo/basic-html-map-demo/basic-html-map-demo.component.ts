import {
  CdkDragEnd,
  CdkDragMove,
  DragDropModule,
  DragRef,
  Point,
} from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { HtmlMapComponent } from '@daxur-studios/graph';

@Component({
  selector: 'app-basic-html-map-demo',
  standalone: true,
  imports: [HtmlMapComponent, DragDropModule],
  templateUrl: './basic-html-map-demo.component.html',
  styleUrl: './basic-html-map-demo.component.scss',
})
export class BasicHtmlMapDemoComponent {
  @ViewChild(HtmlMapComponent) htmlMap!: HtmlMapComponent;

  get cameraSpringArmLength() {
    return this.htmlMap.cameraSpringArmLength;
  }
  get perspective() {
    return this.htmlMap.perspective;
  }

  readonly nodes: INode[] = [
    { position: { x: 100, y: 100 } },
    { position: { x: 200, y: 200 } },
    { position: { x: 300, y: 300 } },
  ];

  //#region Dragging
  dragConstrainPoint = (
    userPointerPosition: Point,
    dragRef: DragRef<INode>,
    dimensions: DOMRect,
    pickupPositionInElement: Point
  ) => {
    const armLength = this.cameraSpringArmLength();
    const scale = this.htmlMap.calculateScale(armLength, this.perspective);

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
  //#endregion
}

interface INode {
  pendingPosition?: Point;
  position: Point;
}
