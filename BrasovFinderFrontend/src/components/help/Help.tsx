import React, {useState} from "react";
import {RouteComponentProps} from "react-router";
import {Menu} from "../menu/Menu";
import {
    IonCardContent,
    IonItem,
    IonLabel,
    IonListHeader,
    IonCard,
    IonList,
    IonCardSubtitle,
    IonCardHeader, IonCardTitle, IonIcon, IonButton
} from "@ionic/react";
import {QuestionCard} from "./QuestionCard";
import {add, ellipse, female, radio} from "ionicons/icons";

export const Help: React.FC<RouteComponentProps> = () => {
    const questions = [
        {
            question: 'Întrebare 1',
            answer: 'Răspunsul la întrebarea 1.',
        },
        {
            question: 'Întrebare 2',
            answer: 'Răspunsul la întrebarea 2.',
        },
        {
            question: 'Întrebare 3',
            answer: 'Răspunsul la întrebarea 3.',
        },
    ];


    function getContent(){
        return (
            <IonList>
                <QuestionCard
                    question={
                    <>
                        <IonIcon icon={female}></IonIcon>
                        <IonLabel>
                            Feedbacks
                        </IonLabel>
                    </>
                    }
                    answer={<>
                        <QuestionCard
                          question='How can we help you improve your experience during visit around the city?'
                          answer='We want to offer the best possible experience. Our advice is to fill in your
                           feedback for every visited place and your suggestions about what you liked or disliked,
                           which would represent a helping hand for the other users.'
                        />
                        <QuestionCard
                            question='How can I let a feedback?'
                            answer='You have to access the menu of application and navigate to home page
                                    where you will have to choose the place that you want to visit and then complete textfields
                                    In this way, you can let your thoughts and experience and let the other users guide after
                                    main parts from your point of view'
                        />
                    </>
                    }
                />
                <QuestionCard
                    question={
                    <>
                        <IonIcon icon={radio}></IonIcon>
                        <IonLabel>
                            Visited places
                        </IonLabel>
                    </>
                    }
                    answer={
                        <>
                            <QuestionCard
                                question='What actions can you take with regard to visited places?'
                                answer='The app should present you the posibilities of adding, updating for an user, additionally deleting for the admin.
                                Everyone of you can take multiple photos to immortalize beautiful experiences spent with loved ones at a given place'
                            />
                            <QuestionCard
                                question='Do you have any suggestion for some new locations that you want to add in your app?'
                                answer='We want to extend and to enrich the virtual tour of the city and to offer a large variety of places. Please feel
                                        free to complete our add place textfields. Any idea of a new and very interesting place to isit is more than welcomed.'
                            />
                        </>
                    }
                />
                <QuestionCard
                    question='Intrebare 3'
                    answer={<p>Raspunsul la intrebarea 3</p>}
                />
            </IonList>
        )
    }
    return (
        <Menu content={getContent()} background_color="#cc0000"/>
    );
}

export default Help;