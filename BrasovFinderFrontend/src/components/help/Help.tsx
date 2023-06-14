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
import {add, ellipse, female, mail, radio, settings} from "ionicons/icons";

export const Help: React.FC<RouteComponentProps> = () => {


    function getContent(){
        return (
            <IonList color="primary" className="card-question-container">
                <QuestionCard
                    backgroundColor="#ff0000"
                    question={
                    <>
                        <IonIcon icon={mail}></IonIcon>
                        <IonLabel>
                            Feedbacks
                        </IonLabel>
                    </>
                    }
                    answer={<>
                        <QuestionCard
                            backgroundColor="white"
                          question='How can we help you improve your experience during visit around the city?'
                          answer='We want to offer the best possible experience. Our advice is to fill in your
                           feedback for every visited place and your suggestions about what you liked or disliked,
                           which would represent a helping hand for the other users.'
                        />
                        <QuestionCard
                            backgroundColor="white"
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
                    backgroundColor="#ff1100"
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
                                backgroundColor="white"
                                question='What actions can you take with regard to visited places?'
                                answer='The app should present you the posibilities of adding, updating for an user, additionally deleting for the admin.
                                Everyone of you can take multiple photos to immortalize beautiful experiences spent with loved ones at a given place'
                            />
                            <QuestionCard
                                backgroundColor="white"
                                question='Do you have any suggestion for some new locations that you want to add in your app?'
                                answer='We want to extend and to enrich the virtual tour of the city and to offer a large variety of places. Please feel
                                        free to complete our add place textfields. Any idea of a new and very interesting place to visit is more than welcomed.'
                            />
                        </>
                    }
                />
                <QuestionCard
                    backgroundColor="#ff2200"
                    question={
                        <>
                            <IonIcon icon={settings}></IonIcon>
                            <IonLabel>
                                Curiosities
                            </IonLabel>
                        </>
                    }
                    answer={<>
                        <QuestionCard
                            backgroundColor="white"
                            question='Why was a sorting formula with an artificial intelligence model used instead of a traditional sorting method?'
                            answer='Utilizing a sorting formula with an artificial intelligence model offers several advantages over traditional sorting methods:
                                    - complex decision-making: An AI model can take into account multiple factors simultaneously and make complex decisions based on
                                    various input parameters
                                    -adaptability and learning: AI models have the ability to learn and adapt over time. They can analyze
                                    large amounts of data, identify patterns, and continuously improve their performance.
                                    -scalability: AI models can efficiently process large amounts of data and sort through
                                     extensive lists of tourist attractions.'
                        />
                        <QuestionCard
                            backgroundColor="white"
                            question='When using Google Maps, how can users visualize the three available routes between two locations and determine the estimated
                             travel time by both car and walking, additionally transit?'
                            answer='When using Google Maps, users can easily visualize the three available routes between two locations and determine the estimated travel time by car, walking, and transit. Here is how:
                            Enter the source and destination locations: In the search bar or text fields provided, enter the starting point (source) and the destination.iew the routes on the map: Once you have completed
                             the textfields, Google Maps will display the three available routes on the map.'
                        />
                    </>}
                />
            </IonList>
        )
    }
    return (
        <Menu content={getContent()} background_color_header="#333399" background_color_body="#33ccff"/>
    );
}

export default Help;