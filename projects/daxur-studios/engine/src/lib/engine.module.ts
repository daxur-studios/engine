import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AmbientLightComponent,
  ArrowHelperComponent,
  BoxGeometryComponent,
  BufferAttributeComponent,
  CapsuleGeometryComponent,
  DirectionalLightComponent,
  EngineMeshComponentsModule,
  GltfComponent,
  GridHelperComponent,
  GroupComponent,
  KeyboardControlsComponent,
  MeshBasicMaterialComponent,
  MeshNormalMaterialComponent,
  MeshStandardMaterialComponent,
  OrbitControlsComponent,
  PhysicsComponentsModule,
  PointLightComponent,
  EngineParticlesModule,
  PointsMaterialComponent,
  RaycastDirective,
  SceneComponent,
  SphereGeometryComponent,
  EngineMaterialsModule,
  SpriteComponent,
  Css3dComponent,
  Css2dComponent,
} from './components';
import { EngineCurveModule } from './components/curve';

const importExport = [
  CommonModule,
  PhysicsComponentsModule,
  EngineMaterialsModule,
  EngineParticlesModule,
  EngineMeshComponentsModule,
  EngineCurveModule,

  SceneComponent,
  GridHelperComponent,
  OrbitControlsComponent,

  GroupComponent,
  PointLightComponent,
  AmbientLightComponent,
  DirectionalLightComponent,
  PointLightComponent,
  SphereGeometryComponent,
  BoxGeometryComponent,
  KeyboardControlsComponent,
  CapsuleGeometryComponent,
  BufferAttributeComponent,
  GltfComponent,
  ArrowHelperComponent,
  SpriteComponent,
  RaycastDirective,
  Css2dComponent,
  Css3dComponent,
];

@NgModule({
  imports: [...importExport],
  exports: [...importExport],
})
export class EngineModule {}
