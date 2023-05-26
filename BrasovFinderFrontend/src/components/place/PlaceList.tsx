import React, {useContext, useEffect, useState} from "react";
import {RouteComponentProps, useHistory} from "react-router";
import {AuthContext} from "../auth";
import {PlaceProps} from "./PlaceProps";
import {
    IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonPage, IonRouterLink,
    IonSearchbar, IonTitle, IonToolbar,
    useIonViewWillEnter
} from "@ionic/react";
import {alertController, createAnimation} from "@ionic/core";
import Place from "./Place";
import {
    addVisit,
    deletePlace,
    deleteVisit,
    findFirstImageById,
    findPlaceById,
    findVisitByUserIdAndPlaceId,
    getPlaces
} from "./PlaceApi";
import {Menu} from "../menu/Menu";
import {MapModal} from "../modal/MapModal";
import "./css/PlaceList.css";
import {dateToString} from "../../utils/Utils";
import {filter, pencil, trash} from "ionicons/icons";
import {usePhotoGallery} from "../photo/usePhotoGallery";
import place from "./Place";
import {ImageProps} from "./ImageProps";
import {findUserByToken} from "../auth/authApi";
import {UserProps} from "./UserProps";
import {VisitProps} from "./VisitProps";



const indicesPresented = 5;

const PlaceList: React.FC<RouteComponentProps> = (match) =>{
    const { token } = useContext(AuthContext);
    const history = useHistory();
    const [places,setPlaces] = useState<PlaceProps[]>([]);
    const [filteredPlaces, setFilteredPlaces] = useState<PlaceProps[]>([]);
    const [searchText,setSearchText] = useState('');
    const [index, setIndex] = useState<number>(0);
    const [items,setItems] = useState<PlaceProps[]>([]);
    const [hasMore,setHasMore] = useState<boolean>(true);
    const [hasFetched, setHasFetched] = useState<boolean>(false);
    const [photos, setPhotos] = useState<{[key: number]:any}>({});
    const [user,setUser] = useState<UserProps>();
    const [visit,setVisit] = useState<VisitProps>();
    const [userId,setUserId] = useState<number>();
    const [visitPlace,setVisitPlace] = useState<boolean>(false);
    const [placeId,setPlaceId] = useState<number>(0);
    useEffect(()=>{
        const fetchPlaces = async () =>{
            const placesData = await getPlaces(token);
            setPlaces(placesData);
            setFilteredPlaces(placesData);
            const foundPhotos:{[key: number]:any} = {};
            for (const place1 of placesData) {
                if (typeof place1.place_id !== "undefined") {
                    foundPhotos[place1.place_id] = await getOnePhoto(place1.place_id);
                }
            }
            setPhotos(foundPhotos);
        };

        fetchPlaces();
        console.log(photos);
    },[token]);

    const handleSearch = (event: CustomEvent) => {
        const text = event.detail.value.toLowerCase();
        setSearchText(text);
        const filtered = places.filter(place => place.name.toLowerCase().includes(text));
        setFilteredPlaces(filtered);
    };

    useEffect(simpleAnimation,[]);

    if (!hasFetched) {
        if (places){
            fetchData();
            setHasFetched(true);
        }
    }

    function fetchData() {
        if (places){
            const newIndex = Math.min(index + indicesPresented, places.length);
            if(newIndex >= places.length) {
                setHasMore(false);
            }
            else {
                setHasMore(true);
            }
            setItems(places.slice(0,newIndex));
            setIndex(newIndex);
        }
    }
    useIonViewWillEnter(async () =>{
        await fetchData();
    });

    async function searchNext($event: CustomEvent<void>) {
        await fetchData();
        await ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    function handleTextChange(e:any) {
        setPlaces([]);
        setIndex(0);
        setHasFetched(false);
        setHasMore(true);
    }

    function simpleAnimation(){
        const el = document.querySelectorAll('.place-list');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(5000)
                .iterations(1)
                .fromTo('transform', 'translateX(50%)','translateX(0px)');
            animation.play();
        }
    }

    useEffect(()=>{
        const fetchUsernameByUser = async () => {
            const user1 = await findUserByToken(token);
            setUser(user1);
            setUserId(user1.id);
            console.log("Id-ul userului preluat este ",user1?.id);

            // const visit = await findVisitByUserIdAndPlaceId(token,placeId??0,user1.id??0);
            // console.log("Vizita arata cam asa "+typeof visit);
            // if (visit === ""){
            //     setVisitPlace(true);
            // }
            // else
            // {
            //     setVisitPlace(false);
            // }
        }
        fetchUsernameByUser();
    },[]);

    // const handleGetVisit = async (place_id: number) =>{
    //     try {
    //         const visit1 = await findVisitByUserIdAndPlaceId(token,place_id,userId??0);
    //         setVisit(visit1);
    //     }catch (error){
    //             console.log("Failed to fetch visit!");
    //         }
    //     }






    const handleDelete = async(place_id: number | undefined) => {
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
                        if (typeof place_id === "undefined"){
                            return;
                        }
                        try{
                            deletePlace(token,place_id);
                            const fetchedList = filteredPlaces.filter(place => place.place_id !== place_id);
                            setFilteredPlaces(fetchedList);
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



    const getOnePhoto = async (place_id: number) => {
        const photo = await findFirstImageById(token, place_id);
        if (!photo) {
            return null;
        }
        return <img height="auto" src={photo.photo_path} alt="place" />;
    };



     function getContent() {
        return (
            <>
                {/*<IonSearchbar value={searchText} onIonChange={e => handleTextChange(e)}/>*/}
                <IonSearchbar className="searchbar-content" value={searchText} onIonChange={handleSearch}></IonSearchbar>
                <IonList class="place-list1">
                    {filteredPlaces.map(place =>(//{place_id,name,booked_date,price,latitude,longitude}) =>
                         // <Place key={place_id} place_id={place_id} onEdit={place_id1 => history.push(`/place/${place_id1}`)} name={name} booked_date={booked_date} price={price}
                         //        latitude={latitude} longitude={longitude}/>
                        <IonCard className={`card-item1 ${visitPlace ? "visited-card" : "unvisited-card"}`} key={place.place_id}>
                            {photos[place.place_id??0]}
                            {/*{setPlaceId(place.place_id??0)}*/}

                            <IonCardHeader>
                                <IonCardSubtitle>You visited on {dateToString(place.booked_date)}</IonCardSubtitle>
                                <IonCardTitle>{place.name}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <p>It costs: {place.price}</p>
                                <p>Latitude: {place.latitude}</p>
                                <p>Longitude: {place.longitude}</p>
                                <p>Number of points: {place.points}</p>
                            </IonCardContent>
                            <div className="buttons-card">
                                {place.latitude && place.longitude &&
                                    <MapModal latitude={place.latitude} longitude={place.longitude}/>}
                                <IonButton color="warning" routerLink={`/place/${place.place_id}`}>
                                    <IonIcon icon={pencil} slot="icon-only"></IonIcon>
                                </IonButton>
                                <IonButton color="danger" onClick={()=> handleDelete(place.place_id)}>
                                    <IonIcon icon={trash} slot="icon-only"></IonIcon>
                                </IonButton>
                            </div>

                        </IonCard>
                    ))}
                </IonList>
                <IonInfiniteScroll className="inner-scroll1" threshold="0px" disabled={!hasMore}
                                   onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent
                        loadingText="Loading more places...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>
                {/*{fetchingError && (*/}
                {/*    <div>{fetchingError.message || 'Failed to fetch items'}</div>*/}
                {/*)}*/}
            </>
        );
    }
    return (
        <Menu content={getContent()} background_color="#333399" />
);
}

export default PlaceList;