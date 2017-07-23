import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopNavComponent } from './topnav/topnav.component';
import { FooterComponent } from './footer/footer.component';
import { HttpModule } from '@angular/http';
import { HomeComponent } from './home/home.component';
import { SocketService } from '../shared/socket.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Angulartics2Module } from 'angulartics2';

@NgModule({
    declarations: [HomeComponent,
                    TopNavComponent,
                    FooterComponent],
    exports: [CommonModule,
        FormsModule,
        RouterModule,
        HomeComponent,
        TopNavComponent,
        FooterComponent],
    imports: [
        CommonModule,
        HttpModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        Angulartics2Module.forChild()
    ],
    providers: [SocketService]
})

export class MainModule {}