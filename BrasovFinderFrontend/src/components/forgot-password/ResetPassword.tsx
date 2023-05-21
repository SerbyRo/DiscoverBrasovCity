import {useHistory, useParams} from "react-router";
import React, {useState} from "react";
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
    const {token} = useParams();
    const [password,setPassword] = useState<string>('');
    const [confirmPassword,setConfirmPassword] = useState<string>('');
    const [isSubmitting,setIsSubmitting] = useState<boolean>(false);
    const [message,setMessage] = useState<string>('');

    const handleSubmit = async (e:any) =>{
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.put('http://localhost:8080/api/reset/reset-password/'+ token, {newPassword:password});
            setMessage('Password was reset with success');
            history.push("/login");
        }catch (error){
            setMessage('Password could not be reset');
        }finally {
            setIsSubmitting(false);
        }
    };

    return (
        <IonPage className="ion-page2">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Reset your password
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form>
                    <IonLabel>
                        Introduce new password:
                    </IonLabel>
                    <IonInput
                        type="password"
                        placeholder="New password"
                        value={password}
                        onIonChange = {
                            (e) => setPassword(e.detail.value || '')
                        }/>
                    <IonInput
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