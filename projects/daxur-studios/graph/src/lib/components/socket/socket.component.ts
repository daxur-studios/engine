import { Component, Input } from '@angular/core';
import { IOutput } from '../../models';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'lib-socket',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './socket.component.html',
  styleUrl: './socket.component.scss',
})
export class SocketComponent {
  @Input({ required: true }) socket!: IOutput;
}
