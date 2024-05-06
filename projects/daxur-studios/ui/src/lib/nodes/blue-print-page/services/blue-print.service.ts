import { Injectable, signal } from '@angular/core';
import { BluePrintForm } from '../models';
import { Point } from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';
import { HtmlMapComponent } from '../../../graph';

@Injectable({
  providedIn: 'root',
})
export class BluePrintService {
  readonly htmlMap = signal<HtmlMapComponent | undefined>(undefined);
  readonly formGroup = BluePrintForm.createGroup();
  readonly value = signal<BluePrintForm.Group['value']>(this.formGroup.value);

  constructor() {
    this.formGroup.valueChanges.subscribe((value) => {
      console.log('valueChanges', value);
      this.value.set(value);
    });
  }

  public addNode() {
    this.formGroup.controls.nodes.push(
      BluePrintForm.createNodeGroup({
        connectors: [
          {
            label: 'Input',
            type: 'input',
          },
          {
            label: 'Output',
            type: 'output',
          },
        ],
      })
    );
  }

  //#region Export/Import
  public export() {
    const json = BluePrintForm.exportAsJson(this.formGroup);
    navigator.clipboard.writeText(json);
  }
  public async import() {
    const json = await navigator.clipboard.readText();
    if (json) {
      BluePrintForm.importFromJson(this.formGroup, json);
    } else {
      const json = prompt('Paste JSON here');
      if (json) {
        BluePrintForm.importFromJson(this.formGroup, json);
      }
    }
  }
  //#endregion

  //#region Node Clicks
  readonly currentInput = signal<BluePrintForm.NodeGroup | undefined>(
    undefined
  );
  readonly currentOutput = signal<BluePrintForm.NodeGroup | undefined>(
    undefined
  );

  /**
   * The position of the connectors to draw lines between them.
   * Eg `${nodeId}-${connectorId}` --> {x,y}
   */
  readonly connectorMetaData$ = new BehaviorSubject<Map<string, HTMLElement>>(
    new Map()
  );

  inputClicked(group: BluePrintForm.NodeGroup) {
    this.currentInput.set(group);

    //#region Create Connector
    const currentInput = this.currentInput();
    const currentOutput = this.currentOutput();

    const from = currentOutput?.value.id;
    const to = currentInput?.value.id;

    if (
      from &&
      from !== to &&
      !this.checkIfAlreadyConnected(from, to) &&
      !this.checkIfConnectingToParent(from, to)
    ) {
      const connector = BluePrintForm.createConnectorRelationshipGroup({
        fromConnectorId: from,
        toConnectorId: to,
      });

      this.formGroup.controls.connectors.push(connector);
    }
    //#endregion
  }
  outputClicked(group: BluePrintForm.NodeGroup) {
    this.currentOutput.set(group);
  }

  readonly clickedConnectors = new BehaviorSubject<
    BluePrintForm.ConnectorGroup[]
  >([]);
  connectorClicked(group: BluePrintForm.ConnectorGroup, id: string) {}

  public checkIfAlreadyConnected(from?: string | null, to?: string | null) {
    if (!from || !to) return false;

    return this.formGroup.value?.connectors?.some(
      (connector) =>
        connector?.fromConnectorId === from && connector?.toConnectorId === to
    );
  }

  public checkIfConnectingToParent(from?: string | null, to?: string | null) {
    if (!from || !to) return false;
    // TO DO : Implement this function
    return false;
  }

  //#endregion
}
