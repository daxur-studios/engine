import {
  Component,
  EventEmitter,
  Injector,
  OnDestroy,
  OnInit,
  Output,
  contentChildren,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Object3D, Object3DEventMap } from 'three';
import { CanvasComponent } from '../canvas/canvas.component';

import { EngineService } from '../../services/engine.service';
import { EngineStatsComponent } from '../engine-stats/engine-stats.component';
import { SceneTreeComponent } from '../scene-tree/scene-tree.component';
import { EngineUiComponent } from '../engine-ui/engine-ui.component';
import { IKeyBindingOptions, IUserInterfaceOptions } from '../../models';
import { takeUntil } from 'rxjs';
import { Object3DComponent } from '../object-3d-components';

@Component({
  selector: 'daxur-engine',
  templateUrl: './engine.html',
  styleUrls: ['./engine.scss'],
  standalone: true,
  providers: [],
  imports: [CanvasComponent, EngineUiComponent],
})
export class EngineComponent implements OnInit, OnDestroy {
  readonly engineService: EngineService = inject(EngineService, {
    skipSelf: true,
  });

  static instance = 0;
  name = '';

  /** This isn't used */
  readonly parent = input<any>(undefined);

  readonly userInterface = input<IUserInterfaceOptions>({});
  readonly keyBindings = input<IKeyBindingOptions[]>([]);

  @Output() ready: EventEmitter<EngineComponent> = new EventEmitter();

  readonly object3D = signal<Object3D>(this.engineService.scene);

  get canvas() {
    return this.engineService.canvas;
  }
  get renderer() {
    return this.engineService.renderer;
  }
  get scene() {
    return this.engineService.scene;
  }
  get camera() {
    return this.engineService.camera;
  }

  readonly children = contentChildren(Object3DComponent);

  constructor(readonly injector: Injector) {
    EngineComponent.instance++;
    this.name = `Engine ${EngineComponent.instance}`;

    this.engineService.setEngineComponent(this);

    effect(() => {
      const children = this.children();

      children.forEach((child) => {
        this.scene.add(child.object3D());
      });
    });
  }

  ngOnInit(): void {
    this.handleKeyBindings();

    this.engineService.onComponentInit();

    this.ready.emit(this);
  }

  private handleKeyBindings() {
    const keyBindings = this.keyBindings();

    this.engineService.keydown$
      .pipe(takeUntil(this.engineService.onDestroy$))
      .subscribe((event) => {
        if (!event) return;

        keyBindings.forEach((keyBinding) => {
          if (keyBinding.keys.includes(event.key)) keyBinding.keydown(event);
        });
      });
  }

  private x() {}

  ngOnDestroy(): void {
    this.engineService.onComponentDestroy();
  }

  getComponentObject3D(): Object3D<Object3DEventMap> {
    return this.engineService.scene;
  }

  //#region Object3DComponent
  add(object: Object3D): void {
    this.engineService.scene.add(object);
  }
  remove(object: Object3D): void {
    this.engineService.scene.remove(object);
  }
  //#endregion
}
