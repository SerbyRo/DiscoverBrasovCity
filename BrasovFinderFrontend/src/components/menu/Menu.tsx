
import {
    IonButtons,
    IonContent,
    IonHeader, IonIcon, IonLabel, IonList,
    IonMenu,
    IonMenuButton,
    IonPage, IonRouterLink,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {home,person,help,map,trophy,logOut} from "ionicons/icons";
import './css/Menu.css'
import {RouteComponentProps, useHistory} from "react-router";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../auth";
import {Redirect} from "react-router-dom";
import NetworkStatus from "../network/NetworkStatus";
import PlaceList from "../place/PlaceList";
import {UserProps} from "../place/UserProps";

export const Menu = (props: {content: any, background_color?:any})  => {
    const {logout} =useContext(AuthContext);
    const history = useHistory();
    function handleLogout() {
        logout?.();
        history.push('/login');
        console.log("ajunge aici");
    }

    return (
        <>
            <IonMenu contentId="main-content" >
                <IonHeader className="background-menu">
                        <IonToolbar>
                            <IonTitle>Menu</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding background-menu" >
                        <IonList className="list background-menu">
                            <IonRouterLink  routerLink="/home" >

                                {/*<IonItem className="ion-item11">*/}
                                {/*    <IonIcon  className="icon-style" icon={home} slot="start"></IonIcon>*/}
                                {/*    <IonLabel className="text-style">Home</IonLabel>*/}
                                {/*     </IonItem>*/}
                                <div className="list-element-div">
                                    <IonIcon className="icon-style" icon={home} slot="start"></IonIcon>
                                    <IonLabel className="text-style">Home
                                    </IonLabel>
                                </div>
                            </IonRouterLink>
                            <IonRouterLink routerLink="/account">
                                <div className="list-element-div">
                                    <IonIcon className="icon-style" icon={person} slot="start"></IonIcon>
                                    <IonLabel className="text-style">My account
                                    </IonLabel>
                                </div>
                            </IonRouterLink>
                            <IonRouterLink routerLink="/maps">
                                <div className="list-element-div">
                                    <IonIcon className="icon-style" icon={map} slot="start"></IonIcon>
                                    <IonLabel className="text-style">Location
                                    </IonLabel>
                                </div>
                            </IonRouterLink>
                            <IonRouterLink routerLink="/statistics">
                                <div className="list-element-div">
                                    <IonIcon className="icon-style" icon={trophy} slot="start"></IonIcon>
                                    <IonLabel className="text-style">Standings
                                    </IonLabel>
                                </div>
                            </IonRouterLink>
                            <IonRouterLink className="help-last-element" routerLink="/help">
                                <div className="list-element-div">
                                    <IonIcon className="icon-style" icon={help} slot="start"></IonIcon>
                                    <IonLabel className="text-style">Help
                                    </IonLabel>
                                </div>
                            </IonRouterLink>
                            <IonRouterLink onClick={handleLogout}>
                                <div className="list-element-div">
                                    <IonIcon className="icon-style" icon={logOut} slot="start"></IonIcon>
                                    <IonLabel className="text-style">Logout
                                    </IonLabel>
                                </div>
                            </IonRouterLink>
                        </IonList>
                    </IonContent>
            </IonMenu>
            <IonPage  id="main-content">
                <IonHeader style={{backgroundColor:props.background_color}}>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton></IonMenuButton>
                        </IonButtons>
                        <IonTitle>DiscoverCityBrasov</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent style={{backgroundColor:props.background_color}} className="ion-padding">
                    {props.content}
                </IonContent>
            </IonPage>
        </>
    );
};