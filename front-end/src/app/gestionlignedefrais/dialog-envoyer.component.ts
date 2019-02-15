import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-envoyer.html',
  styleUrls: ['./gestionlignedefrais.component.css']
})
export class DialogEnvoyer implements OnInit{
    constructor(
        public dialogRef: MatDialogRef<DialogEnvoyer>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private router : Router) {}
        
    ngOnInit() {
        this.delay(4000).then(any => {
            this.router.navigate(['/gestionnotedefrais']);
            this.dialogRef.close();
        });
    }

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>( {} ));
      }
}