import React, {useContext, useEffect, useState} from "react";
import {RouteComponentProps, useHistory} from "react-router";
import {AuthContext} from "../auth";
import {FeedbackProps} from "../place/FeedbackProps";
import {
    IonAvatar,
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonChip,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonPage,
    IonRouterLink, IonTextarea, IonText, IonIcon, IonButton
} from "@ionic/react";
import {UserProps} from "../place/UserProps";
import {findUserByToken} from "../auth/authApi";
import {Menu} from "../menu/Menu";
import {PlaceProps} from "../place/PlaceProps";
import {
    deleteFeedback,
    deleteVisit,
    findAllPlacesByUserId,
    findVisitByUserIdAndPlaceId,
    getAllFeedbacksByUser,
    getPlaces
} from "../place/PlaceApi";
import place from "../place/Place";
import {VisitProps} from "../place/VisitProps";
import {trash} from "ionicons/icons";
import {alertController} from "@ionic/core";
import './css/MyAccount.css';

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
        const fetchFeedbacksByUserId = async (user_id: number) => {
            const feedbacksData = await getAllFeedbacksByUser(token,user_id);
            setFeedbacks(feedbacksData);
        }
        const fetchUsernameByUser = async () => {
            const user1 = await findUserByToken(token);
            setUser(user1);
            setUserId(user1.id);
            console.log("Id-ul userului logat este "+ user1.id);
            fetchPlacesByUserId(user1.id??0);
            fetchFeedbacksByUserId(user1.id??0);
        }
        fetchUsernameByUser();
    },[]);

    const handleDeleteFeedback = async(feedback_id: number | undefined) => {
        const alert = await alertController.create({
            header: 'Confirm cancel your feedback',
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
                        if (typeof feedback_id === "undefined"){
                            return;
                        }
                        try{

                            deleteFeedback(token,feedback_id);
                            const newFeedbacks = feedbacks.filter(feedback => feedback.feedback_id !== feedback_id);
                            setFeedbacks(newFeedbacks);
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




    function getContent() {
        return(
            <div className="my-account-container">
                <IonListHeader className="my-account-container">
                    <IonLabel className="profile-label">
                        Your Profile
                    </IonLabel>
                </IonListHeader>
                <IonAvatar className="ion-margin-start">
                    <img src="/assets/avatar.svg"/>
                </IonAvatar>

                <IonListHeader className="my-account-container">
                    <IonLabel className="name-label-account">
                        Welcome {user?.username}
                    </IonLabel>
                </IonListHeader>
                <IonChip className="ion-margin-start">
                    <IonAvatar>
                        <img src="/assets/avatar.svg"/>
                    </IonAvatar>
                    <IonLabel color="success" className="email-label-account">
                        {user?.email}
                    </IonLabel>
                </IonChip>

                <IonChip color="danger" className="ion-margin-start points-chip">
                    <IonLabel className="standings-label-account">
                        You acumulated {user?.personal_score} points so far
                    </IonLabel>
                </IonChip>
                <IonList className="my-account-list">
                    <IonListHeader color="primary" className="my-account-list1">
                        {user?.personal_score === 0 ? <IonLabel> You have not visited any place yet </IonLabel>
                            :<IonLabel> Places visited by you </IonLabel>}
                    </IonListHeader>
                    {visits.map(visit =>(
                        <IonRouterLink routerLink={`/place/${visit.place_id}`}>
                            <IonItem className="list-feedbacks" color="primary">
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
                <IonList className="apps-card my-account-list">
                    <IonCardHeader>
                        <IonCardSubtitle className="card-subtitle-container">
                            Your feedbacks
                        </IonCardSubtitle>
                        <IonCardTitle className="card-title-container">
                            Preview of the given feedbacks
                        </IonCardTitle>
                    </IonCardHeader>
                        <IonList className="my-account-list">
                            {feedbacks.map(feedback => (
                                <IonItem color="primary" className="feedback-item-account">
                                    <IonLabel className="feedback-label-account">
                                        <h3 className="feedback-font-name">{feedback.place_name}</h3>
                                        <IonTextarea className="feedback-font-name" readonly>
                                            {feedback.feedback_text}
                                        </IonTextarea>
                                    </IonLabel>
                                    <IonButton color="danger" onClick={()=>handleDeleteFeedback(feedback.feedback_id)}
                                            className="my-account-delete-button">
                                        <IonIcon icon={trash} slot="icon-only"></IonIcon>
                                    </IonButton>
                                </IonItem>
                            ))}
                        </IonList>

                </IonList>
            </div>
        );
    }
    return (
        <Menu content={getContent()} background_color_header="#333399" background_color_body="#33ccff" />
    );

}

export default MyAccount;