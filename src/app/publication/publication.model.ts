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
    id: string;
    endDate: Date;
    startDate: Date;
    title: string;
    approved: boolean;
}

export class Configuration {
    showCalendar: boolean;
}

export class Average {
    like: number;
    score: number;
}

export class Publication {
    id: string;
    average: Average;
    type: string;
    title: string;
    shortId: string;
    configuration: Configuration;
    description: string;
    price: number;
    images: Array<string>;
    reviews: Array<Review>;
    reservations: Array<Reservation>;
    user: any;

    constructor(publicationType: string) {
        this.average = new Average();
        this.title = '';
        this.shortId = '';
        this.configuration = new Configuration();
        this.price = 0;
        this.description = '';
        this.type = publicationType;
        this.reviews = new Array();
        this.images = new Array();
        this.reservations = new Array();
    }
}