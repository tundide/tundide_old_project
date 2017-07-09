import { OpaqueToken } from '@angular/core';

export let APP_CONFIG = new OpaqueToken('app.config');

export interface IAppConfig {
    mapsKey: string;
}

export const AppConfig: IAppConfig = {
    mapsKey: 'AIzaSyCfeshSfAtyd5vGr-S7U7tUIaMez-Z-8F0'
};