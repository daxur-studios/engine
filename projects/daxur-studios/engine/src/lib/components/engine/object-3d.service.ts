import { Injectable, WritableSignal, signal } from '@angular/core';
import { Object3D } from 'three';

// Marker class, used as an interface
// export abstract class Object3DParent {
//   abstract name: string;
//   abstract object3D: WritableSignal<Object3D>;
// }

// @Injectable()
// export class Object3DService {
//   static instance = 0;
//   public id: number;
//   private parentService: Object3DService | null = null;

//   readonly component = signal<Object3DParent | undefined>(undefined);

//   constructor() {
//     Object3DService.instance++;
//     this.id = Object3DService.instance;
//   }

//   setParentService(service: Object3DService) {
//     this.parentService = service;
//   }

//   getParentService(): Object3DService | null {
//     return this.parentService;
//   }

//   setComponent(component: Object3DParent) {
//     this.component.set(component);
//   }
// }
