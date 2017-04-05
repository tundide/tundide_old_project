import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UserResolver } from './auth/user.resolver';
import { SocketService } from './shared/socket.service';
import { ErrorService } from './errors/error.service';
import { PublicationModule } from './publication/publication.module';
import { BudgetModule } from './budget/budget.module';
import { SearchModule } from './search/search.module';
import { MainModule } from './main/main.module';
import { PriceModule } from './price/price.module';
import { AdminModule } from './admin/admin.module';
import { ToastyModule } from 'ng2-toasty';
import { APP_CONFIG, AppConfig } from './app.config';


@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [BrowserModule,
        routing,
        AuthModule,
        PublicationModule,
        BudgetModule,
        SearchModule,
        PriceModule,
        MainModule,
        NgbModule.forRoot(),
        AdminModule.forRoot(),
        ToastyModule.forRoot()
    ],
    providers: [
        AuthService,
        SocketService,
        ErrorService,
        UserResolver,
        { provide: APP_CONFIG, useValue: AppConfig }
    ]
})

export class AppModule { }