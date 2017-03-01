import { OpaqueToken } from '@angular/core';

export let APP_CONFIG = new OpaqueToken('app.config');

export interface IAppConfig {
    apiEndpoint: string;
    mapsKey: string;
}

export const AppConfig: IAppConfig = {
    apiEndpoint: 'http://localhost:3000/api/',
    mapsKey: 'AIzaSyDV0G690zj_ODkINV2Mjdf7rwvPrJ2PwOw'
};