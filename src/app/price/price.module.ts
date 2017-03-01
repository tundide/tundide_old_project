import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PriceComponent } from './price.component';

@NgModule({
    declarations: [ PriceComponent ],
    exports: [ PriceComponent ],
    imports: [  FormsModule,
                RouterModule,
                CommonModule]
})

export class PriceModule {}