import React from "react";
import {PlaceProps} from "./PlaceProps";
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle, IonIcon,
    IonItem,
    IonTitle
} from "@ionic/react";
import {MapModal} from "../modal/MapModal";
import {pencil} from "ionicons/icons";
import {dateToString} from "../../utils/Utils";

interface PlacePropsExt extends PlaceProps {
    onEdit: (_id?: number) => void;
}



const Place: React.FC<PlacePropsExt> = ({place_id, name,price,onEdit,latitude,longitude})=>{
    return(
        <IonCard className="card-item">
            <IonCardHeader>
                <IonCardTitle>Destination is {name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <p>It costs {price} lei</p>
                <p>Latitude: {latitude}</p>
                <p>Longitude: {longitude}</p>
            </IonCardContent>
            {latitude && longitude &&
                <MapModal latitude={latitude} longitude={longitude}/>}
            <IonButton onClick={() => onEdit(place_id)}>
                <IonIcon icon={pencil} slot="icon-only"></IonIcon>
            </IonButton>
        </IonCard>
        )
}

export default Place;

