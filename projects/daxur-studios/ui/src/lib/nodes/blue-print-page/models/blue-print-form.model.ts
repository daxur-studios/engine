import { Point } from '@angular/cdk/drag-drop';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

export module BluePrintForm {
  export type Controls = {
    name: FormControl<string | null>;
    description: FormControl<string | null>;

    nodes: FormArray<NodeGroup>;
    connectors: FormArray<ConnectorRelationshipGroup>;
  };
  export type Group = FormGroup<Controls>;

  export function createGroup(v?: Group['value']): Group {
    return new FormGroup<Controls>({
      name: new FormControl(v?.name ?? null),
      description: new FormControl(v?.description ?? null),

      nodes: new FormArray<NodeGroup>(
        (v?.nodes ?? []).map((node) => createNodeGroup(node))
      ),
      connectors: new FormArray<ConnectorRelationshipGroup>(
        (v?.connectors ?? []).map((connector) =>
          createConnectorRelationshipGroup(connector)
        )
      ),
    });
  }

  //#region Connectors
  export type ConnectorRelationshipControls = {
    fromConnectorId: FormControl<string | null>;
    toConnectorId: FormControl<string | null>;
  };

  export type ConnectorPositionControls = {
    connectorId: FormControl<string | null>;
    position: FormControl<Point | null>;
  };

  export type ConnectorControls = {
    label: FormControl<string | null>;
    type: FormControl<'input' | 'output' | null>;
  };
  export type ConnectorGroup = FormGroup<ConnectorControls>;

  export type ConnectorRelationshipGroup =
    FormGroup<ConnectorRelationshipControls>;

  export function createConnectorRelationshipGroup(
    v?: ConnectorRelationshipGroup['value']
  ): ConnectorRelationshipGroup {
    return new FormGroup<ConnectorRelationshipControls>({
      fromConnectorId: new FormControl(v?.fromConnectorId ?? null),
      toConnectorId: new FormControl(v?.toConnectorId ?? null),
    });
  }
  export function createConnectorGroup(
    v?: ConnectorGroup['value']
  ): ConnectorGroup {
    return new FormGroup<ConnectorControls>({
      label: new FormControl(v?.label ?? null),
      type: new FormControl(v?.type ?? null),
    });
  }
  //#endregion

  //#region Nodes
  export type NodeControls = {
    id: FormControl<string | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    content: FormControl<string | null>;
    position: FormControl<{ x: number; y: number } | null>;

    connectors: FormArray<ConnectorGroup>;
  };
  export type NodeGroup = FormGroup<NodeControls>;

  export function createNodeGroup(v?: NodeGroup['value']): NodeGroup {
    return new FormGroup<NodeControls>({
      id: new FormControl(v?.id ?? generateId()),
      name: new FormControl(v?.name ?? null),
      description: new FormControl(v?.description ?? null),
      content: new FormControl(v?.content ?? null),
      position: new FormControl(v?.position ?? null),

      connectors: new FormArray<ConnectorGroup>(
        (v?.connectors ?? []).map((connector) =>
          createConnectorGroup(connector)
        )
      ),
    });
  }

  //#region Export
  export function exportAsJson(group: Group): string {
    return JSON.stringify(group.value);
  }
  export function importFromJson(group: Group, json: string): void {
    try {
      const value = JSON.parse(json) as Group['value'];
      group.reset();

      group.controls.nodes.clear();
      value.nodes?.forEach((node) => {
        group.controls.nodes.push(createNodeGroup(node));
      });

      group.patchValue(value);
    } catch (error) {
      console.error('Failed to import json', error);
    }
  }
  //#endregion
  //#region ID Generation

  export function generateId(): string {
    interface CountedFunction extends Function {
      counter: number;
      lastTimestamp: number;
    }

    const data = generateId as any as CountedFunction;

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let now = Date.now();
    let result = '';

    if (now === data.lastTimestamp) {
      data.counter++;
    } else {
      data.counter = 0;
      data.lastTimestamp = now;
    }

    // Encode the timestamp
    let timestampPart = now.toString(36).padStart(9, '0');

    // Generate a counter part to ensure uniqueness in case of same-millisecond generation
    let counterPart = data.counter.toString(36).padStart(2, '0');

    // Generate a random part
    let randomPart = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      randomPart += chars[randomIndex];
    }

    result = `${timestampPart}${counterPart}${randomPart}`;
    return result;
  }
  //#endregion
  //#endregion
}
