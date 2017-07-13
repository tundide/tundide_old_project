import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';
import { ResultComponent } from './result.component';
import { SharedModule } from '../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { AppConfig } from '../app.config';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BusyModule } from 'angular2-busy';

@NgModule({
    declarations: [SearchComponent, ResultComponent],
    exports: [SearchComponent],
    imports: [FormsModule,
        RouterModule,
        CommonModule,
        SharedModule.forRoot(),
        NgbModule.forRoot(),
        BusyModule,
        AgmCoreModule.forRoot({
            apiKey: process.env.publickey.maps
        })
    ]
})

export class SearchModule { }