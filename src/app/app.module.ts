import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UserResolver } from './auth/user.resolver';
import { SocketService } from './shared/socket.service';
import { ErrorService } from './errors/error.service';
import { BudgetModule } from './budget/budget.module';
import { SearchModule } from './search/search.module';
import { MainModule } from './main/main.module';
import { MessageModule } from './message/message.module';
import { ToastyModule } from 'ng2-toasty';
import { APP_CONFIG, AppConfig } from './app.config';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [BrowserModule,
        BrowserAnimationsModule,
        routing,
        AuthModule,
        BudgetModule,
        SearchModule,
        MainModule,
        MessageModule,
        NgbModule.forRoot(),
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