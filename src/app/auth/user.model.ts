export class User {
    id: string;
    name: string;
    lastAccess: string;
    shortId: string;
    username: string;
    token: string;
    favorites: Array<string>;
    reservations: Array<any>;
    reviews: any;

    constructor(name, username, shortId, id) {
        this.id = id;
        this.name = name;
        this.lastAccess = '';
        this.shortId = shortId;
        this.username = username;
        this.token = '';
        this.favorites = new Array();
        this.reservations = new Array();
        this.reviews = {score: 0};
        }
}