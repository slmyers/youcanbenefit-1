import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
@Component({
    selector: 'app-detail-modal',
    templateUrl: './detail-modal.component.html',
    styleUrls: ['./detail-modal.component.css']
})
export class DetailModalComponent implements  OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public ref: MatDialogRef<DetailModalComponent>) { }

    ngOnInit() {
        this.data.detailLinks = this.data.detailLinks || [];

        if (this.data.detailLinks.length > 0) {
            this.data.detailLinks = this.data.detailLinks.map(link => {
                if (link.substring(0, 8) !== 'http://') {
                    return 'http://' + link;
                }
                return link;
            })
        }

    }

    close(){
        this.ref.close();
    }
}
