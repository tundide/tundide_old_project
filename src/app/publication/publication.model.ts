export enum PublicationType {
    Property = 1,
    Services,
    Entreteinment,
    Others
}

class Review {
    score: number;
    messages: Array<Message>;

    constructor() {
        this.score = 0;
        this.messages = new Array<Message>();
    }
}

class Message {
    message: string;
    user: string;
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
    review: Review;
    reservations: Array<Reservation>;

    constructor(publicationType: PublicationType) {
        this.title = '';
        this.shortId = '';
        this.price = 0;
        this.description = '';
        this.type = publicationType;
        this.review = new Review();
        this.images = new Array();
        this.reservations = new Array();
    }
}