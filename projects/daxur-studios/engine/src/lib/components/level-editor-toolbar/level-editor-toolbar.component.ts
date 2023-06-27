import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'daxur-level-editor-toolbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './level-editor-toolbar.component.html',
  styleUrls: ['./level-editor-toolbar.component.css'],
})
export class LevelEditorToolbarComponent {}
