import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule }              from './app/app.module';
import { enableProdMode } from '@angular/core';

if (process.env.ENV === 'production') {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).catch((error) => console.log('An error occured in bootsrap :', error));