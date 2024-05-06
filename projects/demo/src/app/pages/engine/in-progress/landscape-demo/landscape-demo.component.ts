import { Component } from '@angular/core';
import {
  EngineComponent,
  SkyDomeComponent,
  CloudComponent,
  LandscapeComponent,
  EngineService,
  provideEngineOptions,
  OrbitControlsComponent,
  GridHelperComponent,
  DirectionalLightComponent,
  AmbientLightComponent,
  PointLightComponent,
} from '@daxur-studios/engine';

@Component({
  selector: 'app-landscape-demo',
  standalone: true,
  imports: [
    EngineComponent,
    LandscapeComponent,
    SkyDomeComponent,
    CloudComponent,
    GridHelperComponent,
    OrbitControlsComponent,
    AmbientLightComponent,
    DirectionalLightComponent,
    PointLightComponent,
  ],
  providers: [EngineService, provideEngineOptions({ showFPS: true })],
  templateUrl: './landscape-demo.component.html',
  styleUrl: './landscape-demo.component.scss',
})
export class LandscapeDemoComponent {}
