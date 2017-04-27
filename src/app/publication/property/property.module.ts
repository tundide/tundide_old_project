import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PropertyEditComponent } from './edit.component';
import { PropertyViewComponent } from './view.component';
import { ReviewViewComponent } from '../review.view.component';
import { ReviewNewComponent } from '../review.new.component';
import { UiSwitchModule } from 'angular2-ui-switch';
import { CKEditorModule } from 'ng2-ckeditor';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AppConfig } from '../../app.config';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkerManager, GoogleMapsAPIWrapper, SebmGoogleMapMarker } from 'angular2-google-maps/core';

@NgModule({
    declarations: [PropertyEditComponent, PropertyViewComponent, ReviewViewComponent, ReviewNewComponent],
    exports: [PropertyEditComponent, PropertyViewComponent, ReviewViewComponent, ReviewNewComponent],
    imports: [FormsModule,
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
    providers: [MarkerManager, GoogleMapsAPIWrapper, SebmGoogleMapMarker]
})

export class PropertyMoudle { }