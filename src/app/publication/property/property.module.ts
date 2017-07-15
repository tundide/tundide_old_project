import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertyEditComponent } from './edit.component';
import { PropertyViewComponent } from './view.component';
import { ReviewViewComponent } from '../review.view.component';
import { ReviewNewComponent } from '../review.new.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { AppConfig } from '../../app.config';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, MarkerManager, GoogleMapsAPIWrapper } from '@agm/core';
import { UiSwitchModule } from 'ng2-ui-switch';

@NgModule({
    declarations: [PropertyEditComponent, PropertyViewComponent, ReviewViewComponent, ReviewNewComponent],
    exports: [PropertyEditComponent, PropertyViewComponent, ReviewViewComponent, ReviewNewComponent],
    imports: [FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CommonModule,
        CKEditorModule,
        SharedModule.forRoot(),
        NgbModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: process.env.publickey.maps
        }),
        UiSwitchModule],
    providers: [MarkerManager, GoogleMapsAPIWrapper]
})

export class PropertyMoudle { }