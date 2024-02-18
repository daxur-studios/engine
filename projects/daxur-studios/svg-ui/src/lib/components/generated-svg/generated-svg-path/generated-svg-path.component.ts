import { Component, HostBinding, Input, signal } from '@angular/core';
import { GeneratedSVG } from '../../../models';

@Component({
  selector: 'path [libGeneratedSvgPath]',
  standalone: true,
  imports: [],
  templateUrl: './generated-svg-path.component.html',
  styleUrl: './generated-svg-path.component.scss',
})
export class GeneratedSvgPathComponent {
  private _path!: GeneratedSVG.Path;
  get path() {
    return this._path;
  }
  @Input({ required: true }) set path(value: GeneratedSVG.Path) {
    this._path = value;
    this.calculateData();
  }

  public data = signal('');

  private calculateData() {
    this.data.set(
      this.path.commands.map(GeneratedSVG.commandToString).join('')
    );
  }

  // [attr.d]="path.d"
  // [attr.fill]="path.fill"
  // [attr.stroke]="path.stroke"
  // [attr.stroke-width]="path.strokeWidth"

  @HostBinding('attr.d') get d() {
    return this.data();
  }
  @HostBinding('attr.fill') get fill() {
    return this.path.fill;
  }
  @HostBinding('attr.stroke') get stroke() {
    return this.path.stroke;
  }
  @HostBinding('attr.stroke-width') get strokeWidth() {
    return this.path.strokeWidth;
  }

  // @Input({ required: false }) fill: string | undefined | null = 'orange';

  // @Input({ required: false }) stroke: string | undefined | null = 'green';
  // @Input({ required: false }) strokeWidth: string | undefined | null = '1';
}
