import React, {useContext, useEffect, useState} from "react";
import {RouteComponentProps, useHistory} from "react-router";
import {AuthContext} from "../auth";
import {
    IonAvatar, IonButton,
    IonCard,
    IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonChip, IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonRouterLink, IonTextarea, IonContent
} from "@ionic/react";
import {trash} from "ionicons/icons";
import {Menu} from "../menu/Menu";
import {UserProps} from "../place/UserProps";
import {findTop5UsersByPersonal_scoreDesc, findUserRankByPersonal_score} from "../place/PlaceApi";
import {findUserByToken} from "../auth/authApi";
import {getRankString} from "../../utils/Utils";
import './css/Standings.css'

const Standings : React.FC<RouteComponentProps> = () => {
    const {token} = useContext(AuthContext);
    const history = useHistory();
    const [loggedUserRank,setLoggedUserRank] = useState<UserProps>();
    const [first5UsersbyRank,setFirst5UsersbyRank] = useState<UserProps[]>([]);
    const [currentUser,setCurrentUser] = useState<UserProps>();

    useEffect(()=>{
        const fetchTop5Users = async () => {
            const standingsUsers = await findTop5UsersByPersonal_scoreDesc(token);
            setFirst5UsersbyRank(standingsUsers);
        }
        const fetchUserByRank = async (user_id: number|undefined) => {
            const loggedUser = await findUserRankByPersonal_score(token,user_id??0);
            setLoggedUserRank(loggedUser);
        }
        const fetchUserByUsername = async () =>{
            const loggedUser = await findUserByToken(token);
            fetchTop5Users();
            fetchUserByRank(loggedUser.id);
        }
        fetchUserByUsername();
    },[]);
    function getContent() {
        return(
            <div className="my-standings-container">
                    <h1>Leaderboards</h1>

                    {loggedUserRank && (
                        <div>
                            <h2>Current user</h2>
                            <IonChip className="chip-standings">
                                <p>
                                    {loggedUserRank.username} : {loggedUserRank.personal_score} points {getRankString(loggedUserRank.position??0)} place
                                </p>
                            </IonChip>
                        </div>
                    )}

                    <h2>Ranking top 5 interested tourists </h2>
                    {first5UsersbyRank.map((user) => (
                        <IonChip className="chip-standings2" key={user.id}>
                            <p>{user.username} : {user.personal_score} points {getRankString(user.position??0)} place</p>
                        </IonChip>
                    ))}
            </div>
        );
    }
    return (
        <Menu content={getContent()} background_color_header="#333399" background_color_body="#33ccff" />
    );
}

export default Standings;