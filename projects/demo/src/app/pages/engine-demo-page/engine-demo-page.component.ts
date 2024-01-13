import { Component, ViewChild } from '@angular/core';
import { EngineComponent } from 'projects/daxur-studios/engine/src/public-api';
import { AxesHelper } from 'three';
@Component({
  selector: 'app-engine-demo-page',
  standalone: true,
  imports: [EngineComponent],
  templateUrl: './engine-demo-page.component.html',
  styleUrl: './engine-demo-page.component.scss',
})
export class EngineDemoPageComponent {
  @ViewChild(EngineComponent, { static: true }) engine?: EngineComponent;
  ngOnInit() {
    this.engine?.scene?.add(new AxesHelper(5));
  }
}
