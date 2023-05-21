import {RouteComponentProps} from "react-router";
import React, {useContext, useEffect, useState} from "react";
import {useMyLocation} from "../map/useMyLocation";
import {PlaceContext} from "./PlaceProvider";
import {AuthContext} from "../auth";
import {PlaceProps} from "./PlaceProps";
import {Photo, usePhotoGallery} from "../photo/usePhotoGallery";
import {
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput, IonDatetime, IonCheckbox, IonLoading, IonFab, IonFabButton, IonIcon, IonActionSheet
} from "@ionic/react";
import NetworkStatus from "../network/NetworkStatus";
import {MyMap} from "../map/MyMap";
import dateFormat from 'dateformat';
import {camera, location, trash} from "ionicons/icons";
import {dateToString} from "../../utils/Utils";
import {Geolocation} from "@capacitor/geolocation";
import {
    addVisit,
    deletePlace,
    deleteVisit,
    findPlaceById,
    findVisitByUserIdAndPlaceId,
    getPlaces,
    updatePlace
} from "./PlaceApi";
import {usePhotos} from "../../utils/usePhotos";
import {Menu} from "../menu/Menu";
import './css/EditPlace.css'
import {alertController} from "@ionic/core";
import {ImageProps} from "./ImageProps";
import {findUserByToken} from "../auth/authApi";
import {UserProps} from "./UserProps";
interface EditPlaceProps extends RouteComponentProps<{
    id?: string;
}>{

}

const EditPlace: React.FC<EditPlaceProps> = ({history,match}) =>{
    const myLocation = useMyLocation();
    const [latitude,setLatitude] = useState<number|undefined>(undefined);
    const [longitude,setLongitude] = useState<number|undefined>(undefined);

    const {token} = useContext(AuthContext);
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [boookedDate, setBookedDate] = useState<Date>(new Date());
    const [place, setPlace] = useState<PlaceProps>();
    const [points,setPoints] = useState<number>(0);
    const [placeState, setPlaceState] = useState<boolean>(false);
    const routeId = match.params.id || '';
    let routeIdNumber = +routeId;
    const {photos, takePhoto, deletePhoto} = usePhotoGallery(token,routeIdNumber);
    const [photoToDelete, setPhotoToDelete] = useState<ImageProps>();
    const IonDateTimeDateFormat = "YYYY-MM-DD HH:mm";
    const [user,setUser] = useState<UserProps>();
    const [userId,setUserId] = useState<number>();
    const [isVisited,setIsVisited] = useState<boolean>(false);
    useEffect(()=>{
        const fetchPlaceById = async () =>{
            const routeId = match.params.id || '';
            let routeIdNumber = +routeId;
            console.log(routeId);
            console.log(routeIdNumber);
            const placeData = await findPlaceById(token,routeIdNumber);
            console.log(placeData);
            setPlace(placeData);
            setName(placeData.name);
            setPrice(placeData.price);
            setBookedDate(placeData.booked_date);
            setLatitude(placeData.latitude);
            setLongitude(placeData.longitude);
            setPoints(placeData.points);
        };

        fetchPlaceById();
    },[]);


    const handleUpdate = async () =>{
        const routeId = match.params.id || '';
        let routeIdNumber = +routeId;
        const placeData = await findPlaceById(token,routeIdNumber);
        const updatedPlace = {
            place_id: placeData.place_id,
            name:name,
            price: price,
            booked_date: boookedDate,
            latitude:latitude??0,
            longitude:longitude??0,
            points:points
        };

        const alert = await alertController.create({
            header: 'Confirm update',
            message: 'Do you want to update?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Update canceled');
                    }
                }, {
                    text: 'OK',
                    handler: () => {
                        try{
                            updatePlace(token,updatedPlace);
                            history.goBack();
                        }catch (error){
                            console.log('Update place error',error);
                        }
                    }
                }
            ]
        });

        await alert.present();
    }

    const handleBack = () => {
        history.goBack()
    }

    function onMap() {
        return (e: any) => {
            setLatitude(Math.floor(e.latLng.lat()*10000)/10000);
            setLongitude(Math.floor(e.latLng.lng()*10000)/10000)
        };
    }

    function stringToDate(string: string | undefined | null): Date {
        return new Date(string || new Date());
    }

    useEffect(()=>{
        const fetchUsernameByUser = async () => {
            const user1 = await findUserByToken(token);
            setUser(user1);
            setUserId(user1.id);
            const routeId = match.params.id || '';
            let routeIdNumber = +routeId;
            const visit = await findVisitByUserIdAndPlaceId(token,routeIdNumber??0,user1.id??0);
            console.log("Vizita arata cam asa "+typeof visit);
            if (visit === ""){
                setIsVisited(false);
            }
            else
            {
                setIsVisited(true);
            }
            console.log(user1);
        }
        fetchUsernameByUser();
    },[]);

    const handleVisit = async (placeId: number) => {
        const visit = {
            place_id: placeId,
            user_id: userId// Adaugă user_id în obiectul visit
            // Alte proprietăți ale vizitei pe care dorești să le adaugi
        };

        try {
            await addVisit(token, visit).then(()=> setIsVisited(true));
            console.log("Visit added successfully");
        } catch (error) {
            console.log("Failed to add visit", error);
        }
    };

    const handleDeleteVisit = async(place_id: number | undefined) => {
        const visit = await findVisitByUserIdAndPlaceId(token,place_id??0,userId??0);
        const alert = await alertController.create({
            header: 'Confirm delete',
            message: 'Do you want to delete?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Delete canceled');
                    }
                }, {
                    text: 'OK',
                    handler: () => {
                        if (typeof visit.visit_id === "undefined"){
                            return;
                        }
                        try{

                            deleteVisit(token,visit.visit_id).then(()=>setIsVisited(false));
                        }catch (error)
                        {
                            console.log('Delete place error',error);
                        }
                    }
                }
            ]
        });

        await alert.present();

    }

    function getContent(){
        return (
            <>
                {/*<NetworkStatus/>*/}
                {isVisited === false
                    ? <IonButton color="tertiary" onClick={()=> handleVisit(place?.place_id??0)}>
                        Visit
                    </IonButton>
                    : <IonButton color="danger" onClick={() => handleDeleteVisit(place?.place_id??0)}>
                        Unvisit
                    </IonButton>
                }
                <IonItem className="input_edit">
                    <IonLabel>Name: </IonLabel>
                    <IonInput  value={name} onIonChange={e => setName(e.detail.value || '')}/>
                </IonItem>
                <IonItem>
                    <IonLabel>The price  per ticket is </IonLabel>
                    <IonInput className="input_edit" type="number" value={price}
                              onIonChange={e => setPrice(e.detail.value ? +e.detail.value : 0)}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="fixed">Date when you'll be visiting: </IonLabel>
                    <IonDatetime className="input_edit" displayFormat={IonDateTimeDateFormat} value={dateToString(boookedDate)}
                                 onIonChange={e => setBookedDate(stringToDate(e.detail.value))}/>
                </IonItem>
                <div>
                    {
                        photos.map(photo =>
                            <img height="300px"
                                 src={photo!!.photo_path}
                                 onClick={() => setPhotoToDelete(photo)}
                                 alt="place"
                            />
                        )
                    }
                </div>


                {latitude && longitude &&
                    <div style={{width: "100%"}}>
                        <MyMap
                            lat={latitude}
                            lng={longitude}
                            onMapClick={onMap()}
                        />
                    </div>}
                {/*<IonLoading isOpen={saving}/>*/}
                {/*{savingError && (*/}
                {/*    <div>{savingError.message || 'Failed to save meal'}</div>*/}
                {/*)}*/}
                <div className="buttons-edit">
                        <IonButton className="button-edit" onClick={handleBack}>
                            Back
                        </IonButton>
                        <IonButton className="button-edit" onClick={handleUpdate}>
                            Edit Place
                        </IonButton>
                </div>

                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton onClick={() => { console.log(place!!.name);return takePhoto(place!!.name);}}>
                        <IonIcon icon={camera}/>
                    </IonFabButton>
                </IonFab>
                <IonActionSheet
                    isOpen={!!photoToDelete}
                    buttons={[{
                        text: 'Delete',
                        role: 'destructive',
                        icon: trash,
                        handler: () => {
                            if (photoToDelete) {
                                deletePhoto(photoToDelete).then(_ => {
                                });
                                setPhotoToDelete(undefined);
                            }
                        }
                    }, {
                        text: 'Cancel',
                        role: 'cancel',
                    }]}
                    onDidDismiss={() => setPhotoToDelete(undefined)}
                />
            </>
        );
    }

    return (
        <Menu content={getContent()} background_color="#ff0"/>
    );
}

export default EditPlace;