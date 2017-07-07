import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PropertyEditComponent } from './edit.component';
import { PropertyViewComponent } from './view.component';
import { ReviewViewComponent } from '../review.view.component';
import { ReviewNewComponent } from '../review.new.component';
import { UiSwitchModule } from 'angular2-ui-switch';
import { CKEditorModule } from 'ng2-ckeditor';
import { AppConfig } from '../../app.config';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, MarkerManager, GoogleMapsAPIWrapper } from '@agm/core';
import { Ng2MDFValidationMessagesModule } from 'ng2-mdf-validation-messages';

@NgModule({
    declarations: [PropertyEditComponent, PropertyViewComponent, ReviewViewComponent, ReviewNewComponent],
    exports: [PropertyEditComponent, PropertyViewComponent, ReviewViewComponent, ReviewNewComponent],
    imports: [FormsModule,
        Ng2MDFValidationMessagesModule.globalConfig({
            class: 'text-danger',
            defaultErrorMessages: {
                maxLength: 'Debe tener {0} caracteres como maximo!',
                minLength: 'Debe tener {0} caracteres como minimo!',
                required: 'Este campo es requerido'
            }
        }),
        ReactiveFormsModule,
        RouterModule,
        CommonModule,
        BrowserAnimationsModule,
        UiSwitchModule,
        CKEditorModule,
        SharedModule.forRoot(),
        NgbModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: AppConfig.mapsKey
        })],
    providers: [MarkerManager, GoogleMapsAPIWrapper]
})

export class PropertyMoudle { }