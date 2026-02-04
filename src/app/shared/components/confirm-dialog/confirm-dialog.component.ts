import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
    <div class="confirm-dialog">
      <div class="confirm-dialog__header">
        <mat-icon [class.text-danger]="data.isDestructive">{{ data.isDestructive ? 'warning' : 'info' }}</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">{{ data.cancelText || 'Annuler' }}</button>
        <button mat-raised-button 
                [color]="data.isDestructive ? 'warn' : 'primary'" 
                (click)="onConfirm()">
          {{ data.confirmText || 'Confirmer' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
    styles: [`
    .confirm-dialog {
      padding: 16px;
      
      &__header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        
        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
        }

        h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }
      }

      mat-dialog-content {
        font-size: 16px;
        color: #4a5568;
        padding: 16px 0;
      }

      mat-dialog-actions {
        padding-top: 16px;
      }

      .text-danger {
        color: #f44336;
      }
    }
  `]
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) { }

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
