import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameScene } from '../../core/game';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldPanelComponent } from '../field-panel/field-panel.component';
import { Object3D } from 'three';
import { EulerField, Field, Vector3Field } from '../../core';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { EngineService } from '../../services';

@Component({
  selector: 'daxur-scene-tree',
  standalone: true,
  imports: [CommonModule, FieldPanelComponent, MatButtonModule, MatIconModule],
  templateUrl: './scene-tree.component.html',
  styleUrls: ['./scene-tree.component.css'],
})
export class SceneTreeComponent implements OnInit, OnDestroy {
  @Input({ required: true }) scene?: GameScene;

  onDestroy$ = new Subject<void>();

  selectedObject3D?: Object3D;
  transformControls: TransformControls | undefined;

  constructor(readonly engineService: EngineService) {}

  ngOnInit(): void {
    this.scene!.addEvent$.pipe(takeUntil(this.onDestroy$)).subscribe(
      (items) => {}
    );

    this.scene!.removeEvent$.pipe(takeUntil(this.onDestroy$)).subscribe(
      (items) => {}
    );
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  selectObject3D(object3D: Object3D | undefined) {
    if (object3D instanceof TransformControls) {
      return;
    }

    this.selectedObject3D = object3D;
    if (this.selectedObject3D) {
      this.transformControls ||= new TransformControls(
        this.engineService.camera,
        this.engineService.renderer!.domElement
      );
      this.transformControls.name = 'TransformControls';
      this.transformControls.attach(this.selectedObject3D);
      this.scene!.add(this.transformControls);
    } else {
      this.transformControls?.detach();
      this.scene!.remove(this.transformControls!);
      this.transformControls = undefined;
    }
  }

  refresh() {
    console.debug('refresh', this.scene);
    this.selectObject3D(undefined);
  }
}
