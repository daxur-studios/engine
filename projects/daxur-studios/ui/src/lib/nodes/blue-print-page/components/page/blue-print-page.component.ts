import { Component, effect, viewChild } from '@angular/core';
import { BluePrintOutputComponent } from '../../blue-print-output/blue-print-output.component';
import { BluePrintService } from '../../services';
import { BluePrintForm } from '../../models';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { BluePrintNodeComponent } from '..';
import { LineComponent } from '../line/line.component';
import { HtmlMapComponent } from '../../../../graph';

@Component({
  selector: 'app-blue-print-page',
  standalone: true,
  imports: [
    BluePrintOutputComponent,
    HtmlMapComponent,
    ReactiveFormsModule,
    DragDropModule,
    MatIconModule,
    BluePrintNodeComponent,
    LineComponent,
  ],
  templateUrl: './blue-print-page.component.html',
  styleUrl: './blue-print-page.component.scss',
  providers: [],
})
export class BluePrintPageComponent {
  readonly htmlMap = viewChild.required(HtmlMapComponent);

  readonly fomGroup = this.bluePrintService.formGroup;

  readonly connectors = this.bluePrintService.formGroup.controls.connectors;

  constructor(readonly bluePrintService: BluePrintService) {
    effect(
      () => {
        this.bluePrintService.htmlMap.set(this.htmlMap());
      },
      { allowSignalWrites: true }
    );
  }

  public addNode() {
    this.bluePrintService.addNode();
  }
  public export() {
    this.bluePrintService.export();
  }
  public import() {
    this.bluePrintService.import();
  }
}
