import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './publication.routing';
import { PublicationComponent } from './publication.component';
import { ViewComponent } from './view.component';
import { PublicationWhatComponent } from './publication.what.component';
import { PublicationPriceComponent } from './publication.price.component';
import { PublicationAvailabilityComponent } from './publication.availability.component';
import { PropertyMoudle } from './property/property.module';
import { ServiceMoudle } from './service/service.module';
import { AuthGuard } from '../auth/auth-guard.service';
import { PublicationService } from './publication.service';
import { ToastyModule } from 'ng2-toasty';
import { WizardModule } from 'ng2-archwizard/dist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [PublicationComponent,
                    ViewComponent,
                    PublicationWhatComponent,
                    PublicationAvailabilityComponent,
                    PublicationPriceComponent],
    exports: [PublicationComponent, ViewComponent, PublicationWhatComponent, PublicationAvailabilityComponent, PublicationPriceComponent],
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