export enum PublicationType {
    Property = 1,
    Services,
    Entreteinment,
    Others
}

export class Review {
    score: number;
    message: string;
    user: string;

    constructor() {
        this.score = 0;
        this.message = '';
        this.user = '';
    }
}

export class Reservation {
    endDate: Date;
    startDate: Date;
    title: string;
    approved: boolean;
}

export class Publication {
    type: PublicationType;
    title: string;
    shortId: string;
    description: string;
    price: number;
    images: Array<string>;
    reviews: Array<Review>;
    reservations: Array<Reservation>;

    constructor(publicationType: PublicationType) {
        this.title = '';
        this.shortId = '';
        this.price = 0;
        this.description = '';
        this.type = publicationType;
        this.reviews = new Array();
        this.images = new Array();
        this.reservations = new Array();
    }
}