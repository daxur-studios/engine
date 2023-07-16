import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameScene } from '../../game';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'daxur-scene-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scene-tree.component.html',
  styleUrls: ['./scene-tree.component.css'],
})
export class SceneTreeComponent implements OnInit, OnDestroy {
  @Input({ required: true }) scene?: GameScene;

  onDestroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.scene!.addEvent$.pipe(takeUntil(this.onDestroy$)).subscribe(
      (items) => {}
    );

    this.scene!.removeEvent$.pipe(takeUntil(this.onDestroy$)).subscribe(
      (items) => {}
    );
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
