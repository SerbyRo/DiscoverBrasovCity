import {useHistory} from "react-router";
import {useParams} from "react-router";
import React, {useState} from "react";
import {baseUrl} from "../../core";
import axios from "axios";
import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonLabel,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import './css/ForgotPassword.css'
export const ResetPassword = () => {
    const history = useHistory();
    const {token} = useParams<{token: string}>();
    const [password,setPassword] = useState<string>('');
    const [confirmPassword,setConfirmPassword] = useState<string>('');
    const [isSubmitting,setIsSubmitting] = useState<boolean>(false);
    const [message,setMessage] = useState<string>('');

    const handleSubmit = async (e:any) =>{
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.put(`http://${baseUrl}/api/reset/reset-password/${token}`, {newPassword:password});
            setMessage('Password was reset with success');
            history.push("/login");
        }catch (error){
            setMessage('Password could not be reset');
        }finally {
            setIsSubmitting(false);
        }
    };

    return (
        <IonPage className="ion-page2 forgot-background">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Reset your password
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="forgot-password-container">
                <form className="reset-password-form">
                    <IonLabel>
                        Introduce new password:
                    </IonLabel>
                    <IonInput
                        className="forgot-password-input"
                        type="password"
                        placeholder="New password"
                        value={password}
                        onIonChange = {
                            (e) => setPassword(e.detail.value || '')
                        }/>
                    <IonInput
                        className="forgot-password-input"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onIonChange = {
                            (e) => setConfirmPassword(e.detail.value || '')
                        }/>
                    {message && <IonLabel color="danger">{message}</IonLabel>}
                    <IonButton expand="block" disabled={isSubmitting || password !== confirmPassword} onClick={handleSubmit}>
                        Reset password
                    </IonButton>
                </form>
            </IonContent>
        </IonPage>
    );
};