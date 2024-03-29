import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './publication.routing';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { WizardComponent } from '../shared/components/wizard/wizard.component';
import { WizardStepComponent } from '../shared/components/wizard/wizard-step.component';
import { PublicationNewComponent } from './publication.new.component';
import { PublicationViewComponent } from './publication.view.component';
import { PublicationEditComponent } from './publication.edit.component';
import { PublicationWhatComponent } from './publication.what.component';
import { PublicationPriceComponent } from './publication.price.component';
import { PublicationReserveComponent } from './publication.reserve.component';
import { PublicationAvailabilityComponent } from './publication.availability.component';
import { PublicationConfigurationComponent } from './publication.configuration.component';
import { PropertyMoudle } from './property/property.module';
import { ServiceMoudle } from './service/service.module';
import { AuthGuard } from '../auth/auth-guard.service';
import { PublicationService } from './publication.service';
import { ReservationService } from './reservation.service';
import { AdvertiserService } from '../advertiser/advertiser.service';
import { ReviewService } from './review.service';
import { FavoriteService } from './favorite.service';
import { MapService } from '../shared/map.service';
import { LocationService } from '../shared/location.service';
import { SharedModule } from '../shared/shared.module';
import { ToastyModule } from 'ng2-toasty';
import { UiSwitchModule } from 'ng2-ui-switch';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [PublicationNewComponent,
        PublicationViewComponent,
        PublicationEditComponent,
        PublicationWhatComponent,
        PublicationAvailabilityComponent,
        PublicationConfigurationComponent,
        PublicationPriceComponent,
        PublicationReserveComponent,
        WizardComponent,
        WizardStepComponent],
    exports: [PublicationNewComponent,
        PublicationViewComponent,
        PublicationEditComponent,
        PublicationWhatComponent,
        PublicationAvailabilityComponent,
        PublicationConfigurationComponent,
        PublicationPriceComponent,
        PublicationReserveComponent,
        WizardComponent,
        WizardStepComponent],
    imports: [routing,
        PropertyMoudle,
        ServiceMoudle,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CommonModule,
        NgbModule,
        NgxErrorsModule,
        SharedModule.forRoot(),
        ToastyModule.forRoot(),
        UiSwitchModule],
    providers: [AuthGuard,
        MapService,
        LocationService,
        PublicationService,
        ReservationService,
        ReviewService,
        FavoriteService,
        AdvertiserService]
})

export class PublicationModule { }