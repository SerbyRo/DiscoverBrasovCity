import React, {useContext, useEffect, useState} from "react";
import {RouteComponentProps, useHistory} from "react-router";
import {AuthContext} from "../auth";
import {FeedbackProps} from "../place/FeedbackProps";
import {IonAvatar, IonChip, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRouterLink} from "@ionic/react";
import {UserProps} from "../place/UserProps";
import {findUserByToken} from "../auth/authApi";
import {Menu} from "../menu/Menu";
import {PlaceProps} from "../place/PlaceProps";
import {findAllPlacesByUserId, findVisitByUserIdAndPlaceId, getPlaces} from "../place/PlaceApi";
import place from "../place/Place";
import {VisitProps} from "../place/VisitProps";

const MyAccount : React.FC<RouteComponentProps> = () => {
    const {token} = useContext(AuthContext);
    const history = useHistory();
    const [user,setUser] = useState<UserProps>();
    const [feedbacks, setFeedbacks] = useState<FeedbackProps[]>([]);
    const [visits, setVisits] = useState<VisitProps[]>([]);
    const [userId, setUserId] = useState<number>();



    useEffect(()=>{

        const fetchPlacesByUserId = async (user_id:number) =>{
            console.log("Id-ul userului dupa care gasim este "+ user_id);
            const visitsData = await findAllPlacesByUserId(token,user_id);
            console.log(visitsData);
            setVisits(visitsData);

        };
        const fetchUsernameByUser = async () => {
            const user1 = await findUserByToken(token);
            setUser(user1);
            setUserId(user1.id);
            console.log("Id-ul userului logat este "+ user1.id);
            fetchPlacesByUserId(user1.id??0);
        }
        fetchUsernameByUser();
    },[]);




    function getContent() {
        return(
            <>
                <IonListHeader>
                    <IonLabel>
                        Your Profile
                    </IonLabel>
                </IonListHeader>
                <IonAvatar className="ion-margin-start">
                    <img src="/assets/avatar.svg"/>
                </IonAvatar>

                <IonListHeader>
                    <IonLabel>
                        Welcome {user?.username}
                    </IonLabel>
                </IonListHeader>

                <IonChip className="ion-margin-start">
                    <IonAvatar>
                        <img src="/assets/avatar.svg"/>
                    </IonAvatar>
                    <IonLabel>
                        {user?.email}
                    </IonLabel>
                </IonChip>

                <IonChip color="success" className="ion-margin-start">
                    <IonLabel>
                        You acumulated {user?.personal_score} points so far
                    </IonLabel>
                </IonChip>
                <IonList>
                    <IonListHeader>
                        {user?.personal_score === 0 ? <IonLabel> You have not visited any place yet </IonLabel>
                            :<IonLabel> Places visited by you </IonLabel>}
                    </IonListHeader>
                    {visits.map(visit =>(
                        <IonRouterLink routerLink={`/place/${visit.place_id}`}>
                            <IonItem>
                                <IonLabel>
                                    <h3>{visit.name}</h3>
                                    {visit.timeSinceVisit === 0
                                        ? <p>You visited it today</p>
                                        : visit.timeSinceVisit === 1
                                            ? <p>You visited it yesterday</p>
                                            :<p>You visited it {visit.timeSinceVisit} days ago</p>}
                                </IonLabel>
                            </IonItem>
                        </IonRouterLink>

                    ))}
                </IonList>
            </>
        );
    }
    return (
        <Menu content={getContent()} background_color="white" />
    );

}

export default MyAccount;