import React, {useState} from "react";
import {RouteComponentProps, useHistory} from "react-router";
import axios from "axios";
import {
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonButton,
    IonRouterLink,
    IonHeader,
    IonToolbar, IonTitle, IonText
} from "@ionic/react";
import './css/ForgotPassword.css'
import {alertController} from "@ionic/core";

export const ForgotPassword : React.FC<RouteComponentProps> = () =>{
    const history = useHistory();
    const [email,setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message,setMessage] = useState('');

    const handleSubmit = async (e:any) =>{
        e.preventDefault();
        setIsSubmitting(true);

        const alert = await alertController.create({
            header: 'Confirm registration',
            message: 'Do you want to register?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Registration canceled');
                    }
                }, // {
                //     text: 'OK',
                //     handler: () => {
                //         fetch('http://localhost:8080/api/reset/reset-password', {
                //             // mode: 'no-cors',
                //             method: 'POST',
                //             headers: {
                //                 'Content-Type': 'application/json'
                //             },
                //             body: JSON.stringify(email)
                //         })
                //             .then(response => {
                //                 console.log(email);
                //                 if (!response.ok) {
                //                     throw new Error('Network response was not ok');
                //                 }
                //                 //return response.json();
                //             })
                //             .then(data => {
                //                 setIsSubmitting(false);
                //                 setMessage("An email with the given instruction for reseting the oassword was sent ");
                //                 history.push("/login");
                //             })
                //             .catch(error => {
                //                 // afiseaza un mesaj de eroare sau executa o alta actiune
                //                 setMessage('Email address not found');
                //                 console.error('There was an error registering the user:', error);
                //             });
                //         console.log('Registration confirmed');
                //     }
                // }
                {
                    text: 'OK',
                    handler: async () => {
                        try {
                            await axios.post('http://localhost:8080/api/reset/reset-password', {email}, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                            setIsSubmitting(false);
                            setMessage("An email with the given instruction for resetting the password was sent");
                            history.push("/login");
                        } catch (error) {
                            // Afiseaza un mesaj de eroare sau executa o alta actiune
                            setMessage('Email address not found');
                            console.error('There was an error registering the user:', error);
                        }
                    }
                }
            ]
        });

        await alert.present();
    }

    return (
        <IonPage className="ion-page2 forgot-background">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Forgot your password
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="forgot-password-container">
                        <form className="forgot-password-form">
                            <IonText>
                                Introduce your email address to reset the password:
                            </IonText>
                            <IonInput className="forgot-password-input" type="email" placeholder="email address" value={email} onIonChange={(e)=> setEmail(e.detail.value || '')}/>
                            {message && <IonText color="danger">{message}</IonText>}
                            <IonButton className="send-mail-button send-mail-button" onClick={handleSubmit}>
                                Send email
                            </IonButton><br/>
                            <IonRouterLink className="forgot-password-link" routerLink={`/login`}>
                                Back to sign in
                            </IonRouterLink>
                        </form>
            </IonContent>
        </IonPage>
    )
};