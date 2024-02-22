import {
  Component,
  ElementRef,
  Input,
  Signal,
  ViewChild,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';
import { GeneratedSVG } from '../../models';
import { GeneratedSvgPathComponent } from './generated-svg-path/generated-svg-path.component';

@Component({
  selector: 'lib-generated-svg',
  standalone: true,
  imports: [GeneratedSvgPathComponent],
  templateUrl: './generated-svg.component.html',
  styleUrl: './generated-svg.component.scss',
})
export class GeneratedSvgComponent {
  @Input({ required: true }) inputs!: WritableSignal<GeneratedSVG.SVGInput[]>;

  @ViewChild('svgElement', { static: true })
  svgElement?: ElementRef<SVGGraphicsElement>;

  readonly width = computed(() => {
    const inputs = this.inputs();

    let maxX = 0;

    inputs.forEach((input) => {
      if (input.type === 'circle') {
        maxX = Math.max(maxX, input.cx + input.r);
      } else {
        input.commands.forEach((command) => {
          if (command.type === 'Z') return;
          maxX = Math.max(maxX, command.x);
        });
      }
    });

    return maxX;
  });
  readonly height = computed(() => {
    const inputs = this.inputs();

    let maxY = 0;

    inputs.forEach((input) => {
      if (input.type === 'circle') {
        maxY = Math.max(maxY, input.cy + input.r);
      } else {
        input.commands.forEach((command) => {
          if (command.type === 'Z') return;
          maxY = Math.max(maxY, command.y);
        });
      }
    });

    return maxY;
  });

  constructor() {}
}
