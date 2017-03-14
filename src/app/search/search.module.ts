import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';
import { ResultComponent } from './result.component';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AppConfig } from '../app.config';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [SearchComponent, ResultComponent],
    exports: [SearchComponent],
    imports: [FormsModule,
        RouterModule,
        CommonModule,
        NgbModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: AppConfig.mapsKey
        })
    ]
})

export class SearchModule { }