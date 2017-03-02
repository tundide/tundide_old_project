export enum PublicationType {
    Property = 1,
    Services,
    Entreteinment,
    Others
}

export class Publication {
    type: PublicationType;
    title: string;
    description: string;
    price: number;

    constructor(publicationType: PublicationType) {
        this.title = '';
        this.price = 0;
        this.description = '';
        this.type = publicationType;
    }
}