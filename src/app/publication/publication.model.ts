export enum PublicationType {
    Property = 1,
    Services,
    Entreteinment,
    Others
}

export class Publication {
    type: PublicationType;
    price: number;

    constructor(publicationType: PublicationType) {
        this.type = publicationType;
    }
}