import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-guard.service';
import { SocketService } from './shared/socket.service';
import { ErrorService } from './errors/error.service';
import { MainModule } from './main/main.module';
import { ToastyModule } from 'ng2-toasty';
import { APP_CONFIG, AppConfig } from './app.config';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [BrowserModule,
        BrowserAnimationsModule,
        routing,
        MainModule,
        NgbModule.forRoot(),
        ToastyModule.forRoot(),
        Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])
    ],
    providers: [
        AuthGuard,
        AuthService,
        SocketService,
        ErrorService,
        { provide: APP_CONFIG, useValue: AppConfig }
    ]
})

export class AppModule { }