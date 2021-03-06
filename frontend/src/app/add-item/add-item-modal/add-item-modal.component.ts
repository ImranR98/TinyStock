import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.scss']
})
export class AddItemModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddItemModalComponent>) { }

  ngOnInit(): void {
  }

  close(e: any) {
    this.dialogRef.close()
  }

}

/*
  constructor(private themeService: ThemeService, private dialog: MatDialog) { }

  addDialog: MatDialogRef<AddItemModalComponent, any> | null = null

  addItem() {
    if (!this.addDialog) {
      this.addDialog = this.dialog.open(AddItemModalComponent)
      this.addDialog.afterClosed().subscribe(() => { })
    } else {
      this.addDialog.close()
      this.addDialog = null
    }
  }
*/