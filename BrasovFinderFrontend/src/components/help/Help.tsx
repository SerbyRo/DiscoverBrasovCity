import React from "react";
import {RouteComponentProps} from "react-router";
import {Menu} from "../menu/Menu";
import {IonItem, IonLabel, IonListHeader} from "@ionic/react";

export const Help: React.FC<RouteComponentProps> = () => {
    function getContent(){
        return (
            // <IonAccordionGroup>
            //     <IonAccordion value="first">
            //         <IonItem slot="header" color="light">
            //             <IonLabel>First Accordion</IonLabel>
            //         </IonItem>
            //         <div className="ion-padding" slot="content">
            //             First Content
            //         </div>
            //     </IonAccordion>
            //     <IonAccordion value="second">
            //         <IonItem slot="header" color="light">
            //             <IonLabel>Second Accordion</IonLabel>
            //         </IonItem>
            //         <div className="ion-padding" slot="content">
            //             Second Content
            //         </div>
            //     </IonAccordion>
            //     <IonAccordion value="third">
            //         <IonItem slot="header" color="light">
            //             <IonLabel>Third Accordion</IonLabel>
            //         </IonItem>
            //         <div className="ion-padding" slot="content">
            //             Third Content
            //         </div>
            //     </IonAccordion>
            // </IonAccordionGroup>
            <IonListHeader>
                <IonLabel>
                    Your Profile
                </IonLabel>
            </IonListHeader>
        )
    }
    return (
        <Menu content={getContent()} background_color="#cc0000"/>
    );
}

export default Help;