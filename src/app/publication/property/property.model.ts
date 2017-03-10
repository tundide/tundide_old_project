import { Publication } from '../publication.model';

export class Property extends Publication {
    details: Details;
    location: Location;
    facilities: Facilities;
    constructor() {
        super('Property');
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
    internet = false;
    security = false;
    lobby = false;
    airconditioning = false;
    powerunit = false;
    buffet = false;
    elevator = false;
    phone = false;
    ramp = false;
    heating = false;
    gas = false;
    openingtothestreet = false;
    reception = false;
    water = false;
}