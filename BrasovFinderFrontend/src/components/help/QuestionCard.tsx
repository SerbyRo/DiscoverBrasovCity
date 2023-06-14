import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel} from "@ionic/react";
import React, {useState} from "react";


export const QuestionCard = (props: {question: any, answer: any, backgroundColor: any}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggleAccordion = () => {
        const updatedState = !isOpen;
        setIsOpen(updatedState);
    };
    return (
        <div style={{backgroundColor: props.backgroundColor}}>
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