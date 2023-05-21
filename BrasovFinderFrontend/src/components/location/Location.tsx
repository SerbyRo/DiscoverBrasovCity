import React, {useContext, useEffect, useRef, useState} from "react";
import {RouteComponentProps, useHistory} from "react-router";
import {AuthContext} from "../auth";
import {UserProps} from "../place/UserProps";
import {FeedbackProps} from "../place/FeedbackProps";
import {findUserByToken} from "../auth/authApi";
import {IonButton, IonLabel, IonListHeader} from "@ionic/react";
import {Menu} from "../menu/Menu";
import {mapsApiKey} from "../map/key/mapsApiKey";
import {Autocomplete, DirectionsRenderer, GoogleMap, LoadScript} from "@react-google-maps/api";


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
    /** @type React.MutableRefObject<HTMLInputElement> */
    const sourceRef = useRef<HTMLInputElement>(null);
    const destinationRef = useRef<HTMLInputElement>(null);

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
    const center = { lat: 48.8584, lng: 2.2945}

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
    };

    const handleSourceChanged = (event:any) => {
        setSource(event.target.value);
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
                            className="clientFormDiv"
                            onBlur={(event)=>{
                                setCalculateDestination(true);
                                setRecall(recall+1);
                                handleDestinationChanged(event);
                            }}
                            required
                        />
                    </Autocomplete>
                    <GoogleMap onLoad={() => setIsLoaded(true)} mapContainerStyle={containerStyle} center={center} zoom={4}>
                        {directionsOptions?.map(({ directions, options }) => (
                            <DirectionsRenderer directions={directions} options={options} />
                        ))}
                    </GoogleMap>
                </LoadScript>
            </>
        );
    }
    return (
        <Menu content={getContent()} background_color="gray" />
    );
}

export default Location;