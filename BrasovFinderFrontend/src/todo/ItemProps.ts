export interface ItemProps {
  _id?: string;
  name: string;
  boooked_date: Date;
  visited: boolean;
  price: number;
  lat: number;
  lng: number;
  photoPath: string;
}
