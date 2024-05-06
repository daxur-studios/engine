import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, effect, input, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BluePrintForm } from '../../models';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BluePrintService } from '../../services';
import { LineComponent } from '../line/line.component';
import { ConnectorComponent } from '../connector/connector.component';

@Component({
  selector: 'app-blue-print-node',
  standalone: true,
  imports: [
    DragDropModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    ConnectorComponent,
    LineComponent,
  ],
  templateUrl: './blue-print-node.component.html',
  styleUrl: './blue-print-node.component.scss',
})
export class BluePrintNodeComponent {
  readonly group = input.required<BluePrintForm.NodeGroup>();

  constructor(readonly bluePrintService: BluePrintService) {
    // effect(() => {
    //   const group = this.group().value;
    //   const metaData = this.bluePrintService.connectorMetaData$.value;
    //   if (this.inputOrigin()) {
    //     metaData.set(`${group.id}-input`, {
    //       x: this.inputOrigin().offsetLeft,
    //       y: this.inputOrigin().offsetTop,
    //     });
    //   }
    //   if (this.outputOrigin()) {
    //     metaData.set(`${group.id}-output`, {
    //       x: this.outputOrigin().offsetLeft,
    //       y: this.outputOrigin().offsetTop,
    //     });
    //   }
    //   this.bluePrintService.connectorMetaData$.next(metaData);
    //   console.warn('metaData', metaData);
    // });
  }

  get inputConnectors() {
    return this.group().controls.connectors.controls.filter(
      (connector) => connector.value.type === 'input'
    );
  }
  get outputConnectors() {
    return this.group().controls.connectors.controls.filter(
      (connector) => connector.value.type === 'output'
    );
  }

  inputClicked() {
    this.bluePrintService.inputClicked(this.group());
  }
  outputClicked() {
    this.bluePrintService.outputClicked(this.group());
  }

  ngOnDestroy() {
    const metaData = this.bluePrintService.connectorMetaData$.value;
    metaData.delete(`${this.group().value.id}-input`);
    metaData.delete(`${this.group().value.id}-output`);
    this.bluePrintService.connectorMetaData$.next(metaData);
  }
}
