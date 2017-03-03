import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertyEditComponent } from './edit.component';
import { PropertyViewComponent } from './view.component';
import { UiSwitchModule } from 'angular2-ui-switch';
import { CKEditorModule } from 'ng2-ckeditor';
import { ImageUploadModule } from 'angular2-image-upload';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AppConfig } from '../../app.config';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [PropertyEditComponent, PropertyViewComponent],
    exports: [PropertyEditComponent, PropertyViewComponent],
    imports: [FormsModule,
        RouterModule,
        CommonModule,
        UiSwitchModule,
        CKEditorModule,
        SharedModule.forRoot(),
        NgbModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: AppConfig.mapsKey
        }),
        ImageUploadModule.forRoot()]
})

export class PropertyMoudle { }