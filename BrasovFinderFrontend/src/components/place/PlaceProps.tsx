import {ImageProps} from "./ImageProps";

export interface PlaceProps{
    place_id?: number;
    name: string;
    booked_date: Date;
    price: number;
    latitude:number;
    longitude: number;
    points: number;
}