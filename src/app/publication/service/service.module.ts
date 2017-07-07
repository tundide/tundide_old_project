import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceEditComponent } from './edit.component';
import { ServiceViewComponent } from './view.component';
import { UiSwitchModule } from 'angular2-ui-switch';
import { CKEditorModule } from 'ng2-ckeditor';
import { AgmCoreModule } from '@agm/core';
import { AppConfig } from '../../app.config';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [ServiceEditComponent, ServiceViewComponent],
    exports: [ServiceEditComponent, ServiceViewComponent],
    imports: [FormsModule,
        RouterModule,
        CommonModule,
        UiSwitchModule,
        CKEditorModule,
        SharedModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: AppConfig.mapsKey
        })]
})

export class ServiceMoudle { }