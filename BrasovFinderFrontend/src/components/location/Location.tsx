import React, {useContext, useEffect, useRef, useState} from "react";
import {RouteComponentProps, useHistory} from "react-router";
import {AuthContext} from "../auth";
import {UserProps} from "../place/UserProps";
import {FeedbackProps} from "../place/FeedbackProps";
import {findUserByToken} from "../auth/authApi";
import {IonButton, IonDatetime, IonIcon, IonInput, IonItem, IonLabel, IonListHeader} from "@ionic/react";
import {Menu} from "../menu/Menu";
import {mapsApiKey} from "../map/key/mapsApiKey";
import {Autocomplete, DirectionsRenderer, GoogleMap, LoadScript} from "@react-google-maps/api";
import {dateToString} from "../../utils/Utils";
import {add, trash} from "ionicons/icons";
import {addFeedback, addVisit, createPlace} from "../place/PlaceApi";
import {alertController} from "@ionic/core";


export const Location: React.FC<RouteComponentProps> = () => {
    const {token} = useContext(AuthContext);
    const history = useHistory();
    const [user,setUser] = useState<UserProps>();
    const [directions, setDirections] = React.useState<google.maps.DirectionsResult[]>();
    const [isLoaded,setIsLoaded] = useState<boolean>(false);
    const [calculateSource,setCalculateSource] = useState<boolean>(false);
    const [calculateDestination,setCalculateDestination] = useState<boolean>(false);
    const [source,setSource] = useState('');
    const [destination1,setDestination1] = useState('');
    const [recall,setRecall] = useState(0);
    const [namePlace,setNamePlace] = useState<string>('');
    const [pricePlace,setPricePlace] = useState<number>(0);
    const [bookedDatePlace,setBookedDatePlace] = useState<Date>(new Date());
    const [pointsPlace,setPointsPlace] = useState<number>(0);
    const [latitudeGeocoder,setLatitudeGeocoder] = useState<number|undefined>(undefined);
    const [longitudeGeocoder,setLongitudeGeocoder] = useState<number|undefined>(undefined);
    const IonDateTimeDateFormat = "YYYY-MM-DD HH:mm";
    /** @type React.MutableRefObject<HTMLInputElement> */
    const sourceRef = useRef<HTMLInputElement>(null);
    const destinationRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        console.log('Latitude Geocoder:', latitudeGeocoder);
    }, [latitudeGeocoder]);

    useEffect(() => {
        console.log('Longitude Geocoder:', longitudeGeocoder);
    }, [longitudeGeocoder]);

    useEffect(() => {
        if (isLoaded && calculateSource && calculateDestination){

            const fetchDirections = async () => {
                //await loadGoogleMapsApi(); // Load the Google Maps API

                // eslint-disable-next-line no-undef
                const directionsService = new google.maps.DirectionsService();

                // const origin = { lat: 46.77478156204557, lng: 23.6217358225497 };
                // const destination = { lat: 45.6525105, lng: 25.6105654 };

                // @ts-ignore
                const origin = source;
                console.log("Sursa: " + origin);
                // @ts-ignore
                const destination = destination1;
                console.log("Destinatia: "+destination);

                const directionPromise1 = new Promise((resolve, reject) => {
                    directionsService.route(
                        {
                            origin,
                            destination,
                            travelMode: google.maps.TravelMode.WALKING,
                        },
                        (result, status) => {
                            if (status === google.maps.DirectionsStatus.OK) {
                                resolve(result);
                            } else {
                                reject(new Error('Error fetching directions: ' + status));
                            }
                        }
                    );
                });
                const directionPromise2 = new Promise((resolve, reject) => {
                    directionsService.route(
                        {
                            origin,
                            destination,
                            travelMode: google.maps.TravelMode.DRIVING,
                        },
                        (result, status) => {
                            if (status === google.maps.DirectionsStatus.OK) {
                                resolve(result);
                            } else {
                                reject(new Error('Error fetching directions: ' + status));
                            }
                        }
                    );
                });

                const directionPromise3 = new Promise((resolve, reject) => {

                        directionsService.route(
                            {
                                origin,
                                destination,
                                travelMode: google.maps.TravelMode.TRANSIT,
                            },
                            (result, status) => {
                                if (status === google.maps.DirectionsStatus.OK) {
                                    resolve(result);
                                } else if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
                                    resolve(null); // Ignoră cazul în care nu există rută
                                } else {
                                    reject(new Error('Error fetching directions: ' + status));
                                }
                            }
                        );
                });


                try {
                    const results = await Promise.all([directionPromise1,directionPromise2,directionPromise3]);
                    const directionsResults = results as google.maps.DirectionsResult[];
                    setDirections(directionsResults);
                    // if (results){
                    //     setLatitudeGeocoder(directionsResults[0].geometry.location.lat());
                    // }
                        // @ts-ignore
                    console.log("Aici e mapsu" + results[0].routes[0].legs[0].duration.text);
                    // @ts-ignore
                    console.log("Aici afisez coordonatele "+ results[0].routes[0].legs[0].start_location.lat())


                    // @ts-ignore
                    const availableRoutes = results.filter(result => result!== null).filter(result => result.routes.length > 0);
                    if (availableRoutes.length === 0) {
                        console.log('Nu există rute disponibile pentru sursa și destinația specificate.');
                        return;
                    }

                    availableRoutes.forEach((result, index) => {
                        console.log(`Ruta ${index + 1}:`);
                        // @ts-ignore
                        console.log('Duration:', result.routes[0].legs[0].duration.text);
                        // @ts-ignore
                        console.log('Distance:', result.routes[0].legs[0].distance.text);
                    });

                    const geocoder = new google.maps.Geocoder();

                    geocoder.geocode({ address: source }, (results, status) => {
                        if (status === google.maps.GeocoderStatus.OK) {
                            console.log("Obiectivul sursa este valid");
                            // Adresa sursă este validă
                            if (results) {
                                console.log("Sursa validă:", results[0].formatted_address);
                            }
                            if (results) {
                                console.log("Coordonate sursă:", results[0].geometry.location);
                            }
                        } else {
                            // Adresa sursă nu este validă sau nu poate fi găsită
                            console.error("Eroare la adresa sursă:", status);
                        }
                    });

                    geocoder.geocode({ address: destination }, (results, status) => {
                        if (status === google.maps.GeocoderStatus.OK) {
                            console.log("Obiectivul destinatie este valid");
                            // Adresa destinație este validă
                            if (results) {
                                console.log("Destinație validă:", results[0].formatted_address);
                            }
                            if (results) {
                                console.log("Coordonate destinație:", results[0].geometry.location);
                            }
                            if (results) {
                                const latitudeGeocoder1 = results[0].geometry.location.lat();
                                setLatitudeGeocoder(latitudeGeocoder1);
                                console.log('Latitude Geocoder:', results[0].geometry.location.lat());

                                const longitudeGeocoder1 = results[0].geometry.location.lng();
                                setLongitudeGeocoder(longitudeGeocoder1);
                                console.log('Longitude Geocoder:', results[0].geometry.location.lng());

                                setCenter({lat: latitudeGeocoder1, lng: longitudeGeocoder1});
                            }

                            // Folosește latitudinea și longitudinea cum ai nevoie


                        } else {
                            // Adresa destinație nu este validă sau nu poate fi găsită
                            console.error("Eroare la adresa destinație:", status);
                        }
                    });

                } catch (error) {
                    // if (error.message.includes('ZERO_RESULTS')) {
                    //     console.log('Nu a fost găsită nicio rută între sursă și destinație.');
                    // } else
                    if (error.message.includes('NOT_FOUND')) {
                        console.log('Adresa sursă sau adresa destinație nu au fost găsite.');
                    } else {
                        console.error('Error fetching directions:', error);
                    }
                }
            };

            fetchDirections();
        }
    }, [isLoaded,calculateSource,calculateDestination,recall]);

    const containerStyle = {
        width: '100%',
        height:'100vh',
    };
    const [center, setCenter] = useState({ lat: 45.657, lng: 25.601});

    const colors = ['blue', 'red', 'purple']; // Culori diferite pentru fiecare direcție
    const directionsOptions = directions?.map((direction, index) => ({
        directions: direction,
        options: {
            polylineOptions: { strokeColor: colors[index] },
            suppressMarkers: false,
        },
    }));

    const handleDestinationChanged = (event:any) => {
        setDestination1(event.target.value);
        const value = event.target.value;
        const destinationText = value.split(',')[0].trim();
        console.log('Source Text:', destinationText);
        setNamePlace(destinationText);
    };

    const handleSourceChanged = (event:any) => {
        setSource(event.target.value);

    };


    function stringToDate(string: string | undefined | null): Date {
        return new Date(string || new Date());
    }

    const addPlace = async () => {
        const addedPlace = {
            name: namePlace,
            booked_date:bookedDatePlace,
            price: pricePlace,
            latitude: latitudeGeocoder??0,
            longitude: longitudeGeocoder??0,
            points: pointsPlace
        };

        const alert = await alertController.create({
            header: 'Confirm add',
            message: 'Do you want to add the place?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Add canceled');
                    }
                }, {
                    text: 'OK',
                    handler: () => {
                        try{
                            console.log("Acesta este place-ul adaugat " + addedPlace);
                            createPlace(token,addedPlace);
                            history.push("/home");
                            //history.goBack();
                        }catch (error){
                            console.log('Update place error',error);
                        }
                    }
                }
            ]
        });

        await alert.present();
    };

    function getContent() {
        return(
            <>
                <LoadScript libraries={["places"]} googleMapsApiKey={mapsApiKey} >
                    <Autocomplete>
                        <input
                            type='text'
                            placeholder='Your location'
                            ref = {sourceRef}
                            //value={source}
                            className="clientFormDiv"
                            onBlur={(event)=>{
                                setCalculateSource(true);
                                setRecall(recall+1);
                                handleSourceChanged(event);
                            }}
                            required
                        />
                    </Autocomplete>
                    <Autocomplete>
                        <input
                            type='text'
                            placeholder='Place location'
                            ref = {destinationRef}
                            //value={destination1}
                            className="clientFormDiv"
                            onBlur={(event)=>{
                                setCalculateDestination(true);
                                setRecall(recall+1);
                                handleDestinationChanged(event);
                            }}
                            required
                        />
                    </Autocomplete>
                    <GoogleMap onLoad={() => setIsLoaded(true)} mapContainerStyle={containerStyle} center={center} zoom={8}>
                        {directionsOptions?.map(({ directions, options }) => (
                            <DirectionsRenderer directions={directions} options={options} />
                        ))}
                    </GoogleMap>
                    <IonItem>
                        <IonLabel>The price  per ticket is </IonLabel>
                        <IonInput className="input_edit" type="number" value={pricePlace}
                                  onIonChange={e => setPricePlace(e.detail.value ? +e.detail.value : 0.0)}/>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="fixed">Date when you'll be visiting: </IonLabel>
                        <IonDatetime className="input_edit" displayFormat={IonDateTimeDateFormat} value={dateToString(bookedDatePlace)}
                                     onIonChange={e => setBookedDatePlace(stringToDate(e.detail.value))}/>
                    </IonItem>
                    <IonItem>
                        <IonLabel>The number of stars</IonLabel>
                        <IonInput className="input_edit" type="number" value={pointsPlace}
                                  onIonChange={e => setPointsPlace(e.detail.value ? +e.detail.value : 0.0)}/>
                    </IonItem>
                    <div>
                        <IonButton color="primary" onClick={()=> addPlace()}>
                            <IonIcon icon={add} slot="icon-only"></IonIcon>
                        </IonButton>
                    </div>
                </LoadScript>
            </>
        );
    }
    return (
        <Menu content={getContent()} background_color="gray" />
    );
}

export default Location;