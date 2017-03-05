import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import '!style-loader!css-loader!sass-loader!../assets/app.scss';
import { AppModuleNgFactory } from '../aot/src/app/app.module.ngfactory';

if (process.env.ENV === 'production') {
    enableProdMode();
}


platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);