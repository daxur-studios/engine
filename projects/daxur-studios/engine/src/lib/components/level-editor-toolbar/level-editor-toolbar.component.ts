import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

import { Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { EngineComponent } from '../engine/engine.component';

import { ProjectService, LevelService, EngineController } from '../../services';
import { ILevel, IProject } from '../../models';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Portal, PortalModule } from '@angular/cdk/portal';
import { FPS_LIMIT_OPTIONS } from '../../core/constants/fps-limit-options';

@Component({
  selector: 'daxur-level-editor-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatSelectModule,
    MatDialogModule,
    PortalModule,
  ],

  templateUrl: './level-editor-toolbar.component.html',
  styleUrls: ['./level-editor-toolbar.component.scss'],
})
export class LevelEditorToolbarComponent implements OnInit, OnDestroy {
  @Input({ required: true }) engine!: EngineComponent;

  get controller(): EngineController {
    return this.engine?.controller();
  }

  unsubscribe: Subject<void> = new Subject<void>();

  toolbarForm = this.builder.group({
    fpsLimit: [0],
    timeSpeed: [1],

    project: [<IProject | null>null],
    level: [<ILevel | null>null],
  });

  FPS_LIMIT_OPTIONS = FPS_LIMIT_OPTIONS;

  rightPortal: Portal<any> | null = null;
  centerPortal: Portal<any> | null = null;
  leftPortal: Portal<any> | null = null;

  constructor(
    private builder: FormBuilder,
    public projectService: ProjectService,
    public levelService: LevelService,
    private dialog: MatDialog
  ) {
    this.toolbarForm.controls.fpsLimit.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.controller.setFPSLimit(value ? Number(value) : 0);
      });

    this.toolbarForm.controls.timeSpeed.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.controller.setTimeSpeed(value ? Number(value) : 1);
      });

    //#region Project
    this.toolbarForm.controls.project.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.projectService.setActiveProject(value, this.dialog);
      });
    //#endregion

    //#region Level
    this.toolbarForm.controls.level.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.levelService.setActiveLevel(value);
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onBeginPlay() {
    this.controller.beginPlay();
  }

  /** Add custom ui elements to the Level Editor Toolbar */
  addToolbarPortal(portal: Portal<any>, position: 'left' | 'center' | 'right') {
    if (position === 'left') {
      this.leftPortal = portal;
    } else if (position === 'center') {
      this.centerPortal = portal;
    } else if (position === 'right') {
      this.rightPortal = portal;
    }
  }

  createProject() {}
  createLevel() {}
}
