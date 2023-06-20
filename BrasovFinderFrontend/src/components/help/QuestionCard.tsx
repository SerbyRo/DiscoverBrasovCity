import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel} from "@ionic/react";
import React, {useEffect, useState} from "react";
import './css/Help.css'
export const QuestionCard = (props: {question: any, answer: any, backgroundColor: any}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    //const [isHidden, setIsHidden] = useState<boolean>(true);
    const [buttonClicks, setButtonClicks] = useState<number>(0);
    // useEffect(() => {
    //     setIsHidden(true);
    // }, []);

    const toggleAccordion = () => {
        const updatedState = !isOpen;
        setIsOpen(updatedState);
        setButtonClicks(prevClicks => prevClicks + 1);
    };

    let fadeClass = '';
    if (buttonClicks % 2 === 0) {
        fadeClass = 'fade-in';
    } else {
        fadeClass = 'fade-out';
    }
    return (
        <div className={`${fadeClass}`} style={{backgroundColor: props.backgroundColor}}>
                <IonCardHeader onClick={() => toggleAccordion()}>
                    <IonCardTitle>{props.question}</IonCardTitle>
                </IonCardHeader>
                {isOpen && (
                    <IonCardContent>
                        <IonLabel>{props.answer}</IonLabel>
                    </IonCardContent>
                )}
        </div>
    )
}

export default QuestionCard;