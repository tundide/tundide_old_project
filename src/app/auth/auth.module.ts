import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SigninComponent } from './signin.component';
import { SignoutComponent } from './signout.component';
import { ConfirmComponent } from './confirm.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './auth.routing';

@NgModule({
    declarations: [SigninComponent, SignoutComponent, ConfirmComponent],
    exports: [SigninComponent, SignoutComponent, ConfirmComponent],
    imports: [routing,
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule]
})

export class AuthModule { }