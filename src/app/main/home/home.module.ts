import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

@NgModule({
    declarations: [ HomeComponent ],
    exports: [ HomeComponent ],
    imports: [  RouterModule,
                CommonModule                ]
})

export class HomeModule {}