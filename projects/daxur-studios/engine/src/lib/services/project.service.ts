import { Injectable, Component } from '@angular/core';
import { IProject, IProjectGroup } from '../models';
import { BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GenericDialogComponent } from '../components/generic-dialog/generic-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  projectGroups$ = new BehaviorSubject<IProjectGroup[]>([]);

  constructor() {}

  setActiveProject(project: IProject | null, dialog: MatDialog) {
    console.log(project);

    if (!project && dialog) {
      this.openNewProjectDialog(dialog);
      return;
    }
  }

  openNewProjectDialog(dialog: MatDialog) {
    const config: MatDialogConfig<typeof GenericDialogComponent.DIALOG_DATA> = {
      data: {
        title: 'New Project',
        // componentType: nu,
      },
    };
    const ref = dialog.open(GenericDialogComponent, config);
  }

  createProject(project: IProject) {}
}

// @Component({
//   selector: 'daxur-x',
//   template: `hello :)`,
//   styles: [],
//   standalone: true,
//   host: {
//     class: 'flex-page',
//   },
//   providers: [],
//   imports: [],
// })
// class XComponent {}

// export module x {
//   export const component = XComponent;
// }
