import {
  Component,
  TemplateRef,
  Inject,
  ComponentRef,
  ViewContainerRef,
  ViewChild,
  OnInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  ComponentPortal,
  ComponentType,
  DomPortal,
  PortalModule,
  TemplatePortal,
} from '@angular/cdk/portal';

@Component({
  selector: 'daxur-generic-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, PortalModule],
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.css'],
})
export class GenericDialogComponent implements OnInit, OnDestroy {
  public static readonly DIALOG_DATA: {
    title: string;

    componentType?: ComponentType<any>;
    templateRef?: TemplateRef<any>;
    domRef?: ElementRef<any>;
  };
  public static readonly DIALOG_RESULT: {
    result: any;
  };

  componentPortal?: ComponentPortal<
    (typeof GenericDialogComponent.DIALOG_DATA)['componentType']
  >;
  templatePortal?: TemplatePortal<
    (typeof GenericDialogComponent.DIALOG_DATA)['templateRef']
  >;
  domPortal?: DomPortal<(typeof GenericDialogComponent.DIALOG_DATA)['domRef']>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: typeof GenericDialogComponent.DIALOG_DATA,
    public dialogRef: MatDialogRef<GenericDialogComponent>,
    private _viewContainerRef: ViewContainerRef
  ) {
    if (this.data.componentType) {
      this.componentPortal = new ComponentPortal(this.data.componentType);
    }
    if (this.data.templateRef) {
      this.templatePortal = new TemplatePortal(
        this.data.templateRef,
        this._viewContainerRef
      );
    }
    if (this.data.domRef) {
      this.domPortal = new DomPortal(this.data.domRef);
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  close() {
    this.dialogRef.close();
  }
}
