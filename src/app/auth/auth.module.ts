import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SigninComponent } from './signin.component';
import { SignoutComponent } from './signout.component';
import { FormsModule } from '@angular/forms';
import {routing} from './auth.routing';

@NgModule({
    declarations: [ SigninComponent, SignoutComponent ],
    exports: [ SigninComponent, SignoutComponent ],
    imports: [  routing,
                RouterModule,
                CommonModule,
                FormsModule]
})

export class AuthModule {}