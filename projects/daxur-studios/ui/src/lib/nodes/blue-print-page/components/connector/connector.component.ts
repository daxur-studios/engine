import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BluePrintService } from '../../services';
import { BluePrintForm } from '../../models';

@Component({
  selector: 'app-connector',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './connector.component.html',
  styleUrl: './connector.component.scss',
})
export class ConnectorComponent {
  readonly id = input.required<string>();
  readonly connectorGroup = input.required<BluePrintForm.ConnectorGroup>();

  constructor(readonly bluePrintService: BluePrintService) {}

  connectorClicked() {
    this.bluePrintService.connectorClicked(this.connectorGroup(), this.id());
  }
}
