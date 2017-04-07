import { OpaqueToken } from '@angular/core';

export let APP_CONFIG = new OpaqueToken('app.config');

export interface IAppConfig {
    mapsKey: string;
}

export const AppConfig: IAppConfig = {
    mapsKey: 'AIzaSyDV0G690zj_ODkINV2Mjdf7rwvPrJ2PwOw'
};