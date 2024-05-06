import { Component, ElementRef, effect, input, signal } from '@angular/core';
import { BluePrintForm } from '../../models';
import { BluePrintService } from '../../services';

import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { GeneratedSVG, GeneratedSvgComponent } from '../../../../svg-ui';
import { HtmlMapService } from '../../../../graph';

@Component({
  selector: 'app-line',
  standalone: true,
  imports: [GeneratedSvgComponent],
  templateUrl: './line.component.html',
  styleUrl: './line.component.scss',
})
export class LineComponent {
  // readonly connector = input.required<BluePrintForm.ConnectorGroup>();
  readonly group = input.required<BluePrintForm.NodeGroup>();

  readonly inputOrigin = input.required<HTMLElement>();
  readonly outputOrigin = input.required<HTMLElement>();

  readonly generatedSvg$ = new BehaviorSubject<GeneratedSVG.GeneratedSvgData>({
    controlPoints: [],
    elements: [
      {
        type: 'path',
        closePath: false,
        stroke: 'orange',
        strokeWidth: '2px',
        fill: 'none',
        commands: [
          {
            type: 'M',
            x: 0,
            y: 0,
            offsetX: 0,
            offsetY: 0,
            tags: [],
          },
          {
            type: 'L',
            x: 50,
            y: 100,
            offsetX: 0,
            offsetY: 0,
            tags: [],
          },
        ],
      },
    ],
  });

  constructor(
    readonly bluePrintService: BluePrintService,
    readonly htmlMapService: HtmlMapService
  ) {
    effect(() => {
      //  const connector = this.connector();

      const group = this.group().value;
      if (!group.id) {
        return;
      }

      const value = this.bluePrintService.value();

      const metaData = this.bluePrintService.connectorMetaData$.value;

      if (this.inputOrigin()) {
        metaData.set(`${group.id}-input`, this.inputOrigin());
      }

      if (this.outputOrigin()) {
        metaData.set(`${group.id}-output`, this.outputOrigin());
      }

      this.bluePrintService.connectorMetaData$.next(metaData);

      console.warn('connector', this.inputOrigin(), this.outputOrigin());
      console.warn('metaData', metaData);

      const container = this.bluePrintService.htmlMap()?.scene();

      if (container) {
        this.updateLine(
          group.id,
          this.inputOrigin(),
          this.outputOrigin(),
          container.nativeElement
        );
      }
    });

    this.bluePrintService.formGroup.controls.connectors.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {});

    effect(() => {
      const value = this.bluePrintService.value();
      const starters =
        value.connectors?.filter(
          (connector) => connector.fromConnectorId === this.group().value.id
        ) || [];
      const enders = starters.map(
        (starter) => `${starter.toConnectorId}-input`
      );

      console.log('starters', starters);
      console.log('enders', enders);

      const metaData = this.bluePrintService.connectorMetaData$.value;
      enders.forEach((ender) => {
        const endElement = metaData.get(ender);
        const startElement = metaData.get(`${this.group().value.id}-output`);
        if (endElement && startElement) {
          this.updateLine(
            this.group().value.id!,
            startElement,
            endElement,
            this.bluePrintService.htmlMap()?.wrapperElement().nativeElement!
          );
        }
      });
    });
  }

  readonly destroy$ = new Subject<void>();
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getConnectedOnes() {
    const metaData = this.bluePrintService.connectorMetaData$.value;
    const connectedOnes = metaData.get(`${this.group().value.id}-output`);
    return connectedOnes;
  }

  updateLine(
    nodeId: string,
    start: HTMLElement,
    end: HTMLElement,
    container: HTMLElement
  ) {
    const startPos = this.htmlMapService.getElementWorldPosition(start);
    const endPos = this.htmlMapService.getElementWorldPosition(end);
    console.warn({ a: startPos, b: endPos });

    this.generatedSvg$.next({
      controlPoints: [],
      elements: [
        {
          type: 'path',
          closePath: false,
          stroke: 'orange',
          strokeWidth: '2px',
          fill: 'none',
          commands: [
            {
              type: 'M',
              x: startPos.x,
              y: startPos.y,
              offsetX: 0,
              offsetY: 0,
              tags: [],
            },
            {
              type: 'L',
              x: endPos.x,
              y: endPos.y,
              offsetX: 0,
              offsetY: 0,
              tags: [],
            },
          ],
        },
      ],
    });
  }
}
