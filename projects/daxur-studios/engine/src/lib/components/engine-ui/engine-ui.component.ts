import { Component, TemplateRef, input } from '@angular/core';
import { EngineStatsComponent } from '../engine-stats/engine-stats.component';
import { SceneTreeComponent } from '../scene-tree/scene-tree.component';
import { EngineService } from '../../services';
import { IUserInterfaceOptions } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'daxur-engine-ui',
  standalone: true,
  imports: [CommonModule, EngineStatsComponent, SceneTreeComponent],
  templateUrl: './engine-ui.component.html',
  styleUrl: './engine-ui.component.scss',
})
export class EngineUiComponent {
  readonly userInterface = input<IUserInterfaceOptions>({});

  constructor(readonly engineService: EngineService) {}
}
