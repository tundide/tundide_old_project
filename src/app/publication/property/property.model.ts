import { Publication } from '../publication.model';

export class Property extends Publication {
    description: string;
    details: Details;
    location: Location;
    facilities: Facilities;
    constructor() {
        super(1);
        this.description = '';
        this.details = new Details();
        this.location = new Location();
        this.facilities = new Facilities();
    }
}

class Location {
    province: number;
    place: number;
    district: number;
    street: number;
    number: number;
    latitude: number;
    longitude: number;
}


class Details {
    bathrooms: number;
    area: number;
    floor: number;
}

class Facilities {
    internet: boolean;
    security: boolean;
    lobby: boolean;
    airconditioning: boolean;
    powerunit: boolean;
    buffet: boolean;
    elevator: boolean;
    phone: boolean;
    ramp: boolean;
    heating: boolean;
    gas: boolean;
    openingtothestreet: boolean;
    reception: boolean;
    water: boolean;
}