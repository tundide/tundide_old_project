import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './search.routing';
import { SearchComponent } from './search.component';
import { ResultComponent } from './result.component';
import { SharedModule } from '../shared/shared.module';
import { PublicationService } from '../publication/publication.service';
import { ReviewService } from '../publication/review.service';
import { LocationService } from '../shared/location.service';
import { AgmCoreModule } from '@agm/core';
import { AppConfig } from '../app.config';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BusyModule } from 'angular2-busy';

@NgModule({
    declarations: [SearchComponent, ResultComponent],
    exports: [SearchComponent],
    imports: [routing,
        FormsModule,
        RouterModule,
        CommonModule,
        SharedModule.forRoot(),
        NgbModule.forRoot(),
        BusyModule,
        AgmCoreModule.forRoot({
            apiKey: process.env.publickey.maps
        })
    ],
    providers: [
        LocationService,
        PublicationService,
        ReviewService
    ]
})

export class SearchModule { }