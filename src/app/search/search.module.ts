import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';
import { ResultComponent } from './result.component';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AppConfig } from '../app.config';

@NgModule({
    declarations: [SearchComponent, ResultComponent],
    exports: [SearchComponent],
    imports: [FormsModule,
        RouterModule,
        CommonModule,
        AgmCoreModule.forRoot({
            apiKey: AppConfig.mapsKey
        })
    ]
})

export class SearchModule { }