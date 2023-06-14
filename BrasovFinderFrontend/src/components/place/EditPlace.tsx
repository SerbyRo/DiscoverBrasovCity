import {RouteComponentProps} from "react-router";
import React, {useContext, useEffect, useState} from "react";
import {useMyLocation} from "../map/useMyLocation";
import {PlaceContext} from "./PlaceProvider";
import {AuthContext} from "../auth";
import {PlaceProps} from "./PlaceProps";
import {Photo, usePhotoGallery} from "../photo/usePhotoGallery";
import {IonSlide, IonSlides, IonText, IonToast} from '@ionic/react';
import { useRef } from 'react';
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
    IonInput,
    IonDatetime,
    IonCheckbox,
    IonLoading,
    IonFab,
    IonFabButton,
    IonIcon,
    IonActionSheet,
    IonList,
    IonCard,
    IonCardTitle, IonTextarea, IonCardSubtitle
} from "@ionic/react";
import NetworkStatus from "../network/NetworkStatus";
import {MyMap} from "../map/MyMap";
import dateFormat from 'dateformat';
import {camera, location, trash} from "ionicons/icons";
import {dateToString} from "../../utils/Utils";
import {Geolocation} from "@capacitor/geolocation";
import {
    addFeedback,
    addVisit,
    deletePlace,
    deleteVisit,
    findPlaceById,
    findVisitByUserIdAndPlaceId, getAllFeedbacksByPlace, getAllFeedbacksByUser,
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
import {FeedbackProps} from "./FeedbackProps";
interface EditPlaceProps extends RouteComponentProps<{
    id?: string;
}>{

}

const EditPlace: React.FC<EditPlaceProps> = ({history,match}) =>{
    const myLocation = useMyLocation();
    const [latitude,setLatitude] = useState<number|undefined>(undefined);
    const [longitude,setLongitude] = useState<number|undefined>(undefined);
    const [showToast, setShowToast] = useState(false);
    const {token} = useContext(AuthContext);
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
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
    const [feedbacks, setFeedbacks] = useState<FeedbackProps[]>([]);
    const [stars,setStars] = useState<number>(0);
    const [feedbackText,setFeedbackText] = useState<string>('');
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const [addFeedbackText, setAddFeedbackText] = useState<string>('');

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
                            console.log("Locul modificat este: " + updatedPlace);
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

    const handleAddFeedback = async () =>{
        const routeId = match.params.id || '';
        let routeIdNumber = +routeId;
        const placeData = await findPlaceById(token,routeIdNumber);
        const addedFeedback = {
            place_id: placeData.place_id,
            user_id: userId,
            stars: stars,
            feedback_text: feedbackText,
            username: user?.username
        };



        const alert = await alertController.create({
            header: 'Confirm update',
            message: 'Do you want to post the feedback?',
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
                            console.log("Acesta este feedback-ul adaugat " + addedFeedback);
                            addFeedback(token,addedFeedback).then(
                                () => {
                                    const newFeedbacks = addedFeedback ? [...feedbacks,addedFeedback] : [...feedbacks];
                                    setFeedbacks(newFeedbacks);
                                    setAddFeedbackText("Feedback successfully added!");
                                    setShowToast(true);
                                }
                            ).catch(() => {
                                setAddFeedbackText("You already sent a feedback for this place, please try another one!");
                                setShowToast(true);
                            });
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
        const fetchFeedbacksByPlaceId = async (place_id: number) => {
            const feedbacksData = await getAllFeedbacksByPlace(token,place_id);
            console.log("Aici is feedbackurile "+ feedbacksData);
            setFeedbacks(feedbacksData);
        }
        const fetchUsernameByUser = async () => {
            const user1 = await findUserByToken(token);
            setUser(user1);
            setUserId(user1.id);
            const routeId = match.params.id || '';
            let routeIdNumber = +routeId;
            const visit = await findVisitByUserIdAndPlaceId(token,routeIdNumber??0,user1.id??0);
            fetchFeedbacksByPlaceId(routeIdNumber);
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
            user_id: userId
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
            header: 'Confirm cancel your trip',
            message: 'Did you change your mind?',
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
                <IonItem>
                    <IonLabel position="floating">Name: </IonLabel>
                    <IonInput value={name} onIonChange={e => setName(e.detail.value || '')}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">The price per ticket is </IonLabel>
                    <IonInput className="input_edit" type="number" value={price}
                              onIonChange={e => setPrice(e.detail.value ? +e.detail.value : 0)}/>
                </IonItem><br/>
                {!isVisited
                    ? <IonButton className="edit-visit-button" color="tertiary" onClick={()=> handleVisit(place?.place_id??0)}>
                        Mark as visited
                    </IonButton>
                    : <IonButton className="edit-visit-button" color="danger" onClick={() => handleDeleteVisit(place?.place_id??0)}>
                        Unvisit
                    </IonButton>
                }
                <IonCard className="feedback-container">
                    <IonCardSubtitle>
                        List of feedbacks
                    </IonCardSubtitle>
                    <IonCardTitle>
                        Feedbacks given for {place?.name}
                    </IonCardTitle>
                    <IonList className="feedback-list">
                        {feedbacks.map(feedback =>(
                            <div>
                                <IonText>
                                    <h5>{feedback.username} ({feedback.stars} stars)</h5>
                                    <IonText>
                                        {feedback.feedback_text}
                                    </IonText>
                                </IonText>
                            </div>

                        ))}
                    </IonList>
                </IonCard>
                <IonCard className="feedback-container">
                    <IonCardSubtitle>Leave some thoughts</IonCardSubtitle>
                    <IonCardTitle>Give your opinion about {place?.name}</IonCardTitle>
                    <IonItem>
                        <IonLabel position="floating"> Number of stars </IonLabel>
                        <IonInput className="input_edit" type="number" value={stars}
                                  onIonChange={e => setStars(e.detail.value ? +e.detail.value : 0)}/>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating"> Feedback plot</IonLabel>
                        <IonTextarea value={feedbackText} onIonChange={e => setFeedbackText(e.detail.value || '')} />
                    </IonItem><br/>
                    <div className="add-feedback-button-container">
                        <IonButton onClick={handleAddFeedback}>
                            Add feedback
                        </IonButton>
                    </div>
                    <IonToast
                        isOpen={showToast}
                        onDidDismiss={() => setShowToast(false)}
                        message= {addFeedbackText}
                        duration={3000}
                    />
                </IonCard>
                <br/><br/>
                {photos.length > 0 &&
                    <>
                        <IonSlides key={photos.length + "" + Math.random()} pager={true} options={{
                            initialSlide: currentSlide,
                            speed: 400,
                        }}>
                            {
                                photos.map(photo =>
                                    <IonSlide>
                                        <img height="auto"
                                             width="100%"
                                             src={photo!!.photo_path}
                                             onClick={() => {
                                                 setPhotoToDelete(photo);
                                                 setCurrentSlide(photos.indexOf(photo));
                                             }}
                                             alt="place"
                                        />
                                    </IonSlide>
                                )
                            }
                        </IonSlides><br/><br/>
                    </>
                }

                {latitude && longitude &&
                    <div style={{width: "100%"}}>
                        <MyMap
                            lat={latitude}
                            lng={longitude}
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
                    <IonFabButton onClick={() => {
                        console.log(place!!.name);
                        takePhoto(place!!.name).then(() => {
                            setCurrentSlide(photos.length);
                        });
                    }}>
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
                                deletePhoto(photoToDelete);
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
        <Menu content={getContent()} background_color_header="#333399" background_color_body="#33ccff"/>
    );
}

export default EditPlace;