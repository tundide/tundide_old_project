import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './publication.routing';
import { RentComponent } from './rent.component';
import { ViewComponent } from './view.component';
import { RentWhatComponent } from './rent.what.component';
import { RentPriceComponent } from './rent.price.component';
import { RentAvailabilityComponent } from './rent.availability.component';
import { PropertyMoudle } from './property/property.module';
import { ServiceMoudle } from './service/service.module';
import { AuthGuard } from '../auth/auth-guard.service';
import { PublicationService } from './publication.service';
import { ToastyModule } from 'ng2-toasty';
import { WizardModule } from 'ng2-archwizard/dist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [RentComponent, ViewComponent, RentWhatComponent, RentAvailabilityComponent, RentPriceComponent],
    exports: [RentComponent, ViewComponent, RentWhatComponent, RentAvailabilityComponent, RentPriceComponent],
    imports: [routing,
        PropertyMoudle,
        ServiceMoudle,
        WizardModule,
        FormsModule,
        RouterModule,
        CommonModule,
        NgbModule,
        ToastyModule.forRoot()],
    providers: [AuthGuard, PublicationService]
})

export class PublicationModule { }