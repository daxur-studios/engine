import {
  Directive,
  EventEmitter,
  Inject,
  Injectable,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { EngineService, Object3DService } from '@daxur-studios/engine';
import { Subject, takeUntil } from 'rxjs';
import { ArrowHelper, Object3D, Raycaster, Vector2 } from 'three';

export interface IRaycastEvent {
  object: Object3D;
}

interface RaycastEvents {
  rayClick: EventEmitter<IRaycastEvent>;
}

@Directive({
  selector: 'mesh[raycast], line[raycast]',
  standalone: true,
})
export class RaycastDirective implements OnInit, RaycastEvents, OnDestroy {
  @Output() rayClick = new RaycastEventEmitter<IRaycastEvent>();
  @Output() rayClickOutside = new RaycastEventEmitter<IRaycastEvent>();

  readonly raycaster = this.raycastService.raycaster;
  readonly component = this.object3DService.component;

  readonly scene = this.engineService.scene;

  readonly destroy$ = new Subject<void>();

  constructor(
    readonly raycastService: RaycastService,
    readonly engineService: EngineService,
    readonly object3DService: Object3DService
  ) {}

  ngOnInit(): void {
    // Logic to only enable raycast checks if onClick has subscribers.
    // This could be periodically checked or triggered by specific events.
    if (this.rayClick.hasSubscribers) {
      // Implement the logic to perform raycast checks here.
      console.log('Raycast checks enabled');
      this.engineService.mouseup$
        .pipe(takeUntil(this.destroy$))
        .subscribe((event) => {
          if (!event) return;

          // Check if it's a left mouse up
          if (event.button !== 0) return;

          // Assuming `event` contains the mouse event information
          const mousePosition = new Vector2();

          const resolution = this.engineService.resolution$.value;
          // Convert mouse position to NDC
          mousePosition.x = ((event.offsetX ?? 0) / resolution.width) * 2 - 1;
          mousePosition.y = -((event.offsetY ?? 0) / resolution.height) * 2 + 1;

          // Update the raycaster
          this.raycaster.setFromCamera(
            mousePosition,
            this.engineService.camera
          );
          this.raycaster.far = 1000;

          // Perform raycasting
          const object3D = this.object3DService.component()?.object3D();
          if (object3D) {
            const intersects = this.raycastService.raycaster.intersectObject(
              object3D,
              true
            );
            if (intersects.length > 0) {
              // An intersection occurred
              this.rayClick.emit({ object: object3D });
            } else {
              this.rayClickOutside.emit({ object: object3D });
            }
          }

          //#region debug
          const arrow = new ArrowHelper(
            this.raycaster.ray.direction,
            this.raycaster.ray.origin,
            this.raycaster.far,
            0xff0000
          );
          this.scene.add(arrow);
          setTimeout(() => {
            this.scene.remove(arrow);
          }, 10000);

          //#endregion
        });
    } else {
      console.log('Raycast checks disabled');
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

@Injectable({
  providedIn: 'root',
})
export class RaycastService {
  readonly raycaster = new Raycaster();

  // readonly itemsToWatch = new Set<Object3D>();

  constructor() {}
}

class RaycastEventEmitter<T> extends EventEmitter<T> {
  hasSubscribers = false;

  override subscribe(generatorOrNext?: any, error?: any, complete?: any): any {
    this.hasSubscribers = true;
    return super.subscribe(generatorOrNext, error, complete);
  }
}
