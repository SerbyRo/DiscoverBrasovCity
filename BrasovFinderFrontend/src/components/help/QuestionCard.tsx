import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel} from "@ionic/react";
import React, {useState} from "react";


export const QuestionCard = (props: {question: any, answer: any}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggleAccordion = () => {
        const updatedState = !isOpen;
        setIsOpen(updatedState);
    };
    return (
        <IonCard>
            <IonCardHeader onClick={() => toggleAccordion()}>
                <IonCardTitle>{props.question}</IonCardTitle>
            </IonCardHeader>

            {isOpen && (
                <IonCardContent>
                    <IonLabel>{props.answer}</IonLabel>
                </IonCardContent>
            )}
        </IonCard>
    )
}

export default QuestionCard;