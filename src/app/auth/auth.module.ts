import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SigninComponent } from './signin.component';
import { SignoutComponent } from './signout.component';
import { ConfirmComponent } from './confirm.component';
import { PasswordStrengthBar } from '../shared/components/password-strength-bar/password-strength-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { routing } from './auth.routing';

@NgModule({
    declarations: [SigninComponent, SignoutComponent, ConfirmComponent, PasswordStrengthBar],
    exports: [SigninComponent, SignoutComponent, ConfirmComponent],
    imports: [routing,
        RouterModule,
        CommonModule,
        NgxErrorsModule,
        FormsModule,
        ReactiveFormsModule]
})

export class AuthModule { }