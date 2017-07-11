import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceEditComponent } from './edit.component';
import { ServiceViewComponent } from './view.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { AgmCoreModule } from '@agm/core';
import { AppConfig } from '../../app.config';
import { SharedModule } from '../../shared/shared.module';
import { UiSwitchModule } from 'ng2-ui-switch';

@NgModule({
    declarations: [ServiceEditComponent, ServiceViewComponent],
    exports: [ServiceEditComponent, ServiceViewComponent],
    imports: [FormsModule,
        RouterModule,
        CommonModule,
        CKEditorModule,
        SharedModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: process.env.publickey.maps
        }),
        UiSwitchModule]
})

export class ServiceMoudle { }