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
  @Input({ required: true }) paths!: WritableSignal<GeneratedSVG.Path[]>;

  @ViewChild('svgElement', { static: true })
  svgElement?: ElementRef<SVGGraphicsElement>;

  readonly width = computed(() => {
    const paths = this.paths();
    return paths.reduce((max, path) => {
      return path.commands.reduce((max, command) => {
        if (command.type === 'Z') return max;
        return Math.max(max, command.x);
      }, max);
    }, 0);
  });
  readonly height = computed(() => {
    const paths = this.paths();
    return paths.reduce((max, path) => {
      return path.commands.reduce((max, command) => {
        if (command.type === 'Z') return max;
        return Math.max(max, command.y);
      }, max);
    }, 0);
  });

  constructor() {}
}
