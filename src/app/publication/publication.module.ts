import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormWizardModule } from 'angular2-wizard';
import { UiSwitchModule } from 'angular2-ui-switch';
import { routing } from './publication.routing';
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [PublicationNewComponent,
        PublicationViewComponent,
        PublicationEditComponent,
        PublicationWhatComponent,
        PublicationAvailabilityComponent,
        PublicationConfigurationComponent,
        PublicationPriceComponent,
        PublicationReserveComponent],
    exports: [PublicationNewComponent,
        PublicationViewComponent,
        PublicationEditComponent,
        PublicationWhatComponent,
        PublicationAvailabilityComponent,
        PublicationConfigurationComponent,
        PublicationPriceComponent,
        PublicationReserveComponent],
    imports: [routing,
        PropertyMoudle,
        ServiceMoudle,
        FormWizardModule,
        UiSwitchModule,
        FormsModule,
        RouterModule,
        CommonModule,
        NgbModule,
        SharedModule.forRoot(),
        ToastyModule.forRoot()],
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