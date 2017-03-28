export class User {
    name: string;
    lastAccess: string;
    email: string;
    token: string;
    favorites: Array<string>;
    reservations: Array<any>;
    reviews: any;

    constructor(name, email, token) {
        this.name = name;
        this.lastAccess = '';
        this.email = email;
        this.token = token;
        this.favorites = new Array();
        this.reservations = new Array();
        this.reviews = {score: 0};
        }
}