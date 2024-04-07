import {
  Directive,
  EventEmitter,
  Inject,
  Injectable,
  OnInit,
  Output,
} from '@angular/core';
import { Object3D, Raycaster } from 'three';

interface RaycastEvent {
  object: Object3D;
}

interface RaycastEvents {
  onClick: EventEmitter<RaycastEvent>;
}

@Directive({
  selector: 'mesh[raycast], line[raycast]',
  standalone: true,
})
export class RaycastDirective implements OnInit, RaycastEvents {
  @Output() onClick = new EventEmitter<RaycastEvent>();
  constructor(readonly raycastService: RaycastService) {}
  ngOnInit(): void {}
}

@Injectable({
  providedIn: 'root',
})
export class RaycastService {
  readonly raycaster = new Raycaster();

  readonly itemsToWatch = new Set<Object3D>();

  constructor() {}
}
