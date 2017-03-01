import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { ErrorService } from './errors/error.service';
import { HomeModule } from './main/home/home.module';
import { PublicationModule } from './publication/publication.module';
import { SearchModule } from './search/search.module';
import { SharedModule } from './shared/shared.module';
import { PriceModule } from './price/price.module';
import { AdminModule } from './admin/admin.module';
import { APP_CONFIG, AppConfig } from './app.config';


@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [BrowserModule,
        routing,
        AuthModule,
        HomeModule,
        PublicationModule,
        SearchModule,
        PriceModule,
        NgbModule.forRoot(),
        AdminModule.forRoot(),
        SharedModule.forRoot()
    ],
    providers: [
        AuthService,
        ErrorService,
        { provide: APP_CONFIG, useValue: AppConfig }
    ]
})

export class AppModule { }