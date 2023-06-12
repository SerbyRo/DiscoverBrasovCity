import {getLogger} from "../../core";
import React, { useState} from "react";
import {RouteComponentProps} from "react-router";
import {alertController } from '@ionic/core';
import {
    IonAlert,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonLabel,
    IonPage, IonRouterLink,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import './css/Register.css'
const log = getLogger('Register');
interface RegisterState{
    username?: string;
    password?: string;
    email?: string;
}


let usernameInputStatus = false;
let passwordInputStatus = false;
let emailInputStatus = false;

export const Register : React.FC<RouteComponentProps> = ({history}) =>{
    const [state, setState] = useState<RegisterState>({});
    const { username, password, email } = state;
    const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
    const [emailErrorMessage,setEmailErrorMessage] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);


    const validateUsername = (value: any) =>{
        if (value.length<3)
        {
            setIsUsernameValid(false);
            setUsernameErrorMessage("Username must have at least 3 characters long");
        }
        else{
            const regex = /^[^0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*$/;
            const firstCharIsValid = regex.test(value.charAt(0));
            if (!firstCharIsValid)
            {
                setIsUsernameValid(false);
                setUsernameErrorMessage("Username must start with a letter");
            }
            else {
                setIsUsernameValid(true);
                setUsernameErrorMessage('');
            }
        }
    }

    const validatePassword = (value: any) =>{
        if (value.length<5)
        {
            setIsPasswordValid(false);
            setPasswordErrorMessage("Password must have at least 5 characters long");
        }
        else{
            const regex = /^[^0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*$/;
            const firstCharIsValid = regex.test(value.charAt(0));
            if (!firstCharIsValid)
            {
                setIsPasswordValid(false);
                setPasswordErrorMessage("Password must start with a letter");
            }
            else {
                setIsPasswordValid(true);
                setPasswordErrorMessage('');
            }
        }
    }

    const validateEmail = (value:any) =>{
        if (value.length<6)
        {
            setIsEmailValid(false);
            setEmailErrorMessage("Email has not enough characters to be valid");
        }
        else
        {
            const regex =/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
            if (!regex.test(value))
            {
                setIsEmailValid(false);
                setEmailErrorMessage("Emmail format is invalid");
            }
            else
            {
                setIsEmailValid(true);
                setEmailErrorMessage('');
            }
        }
    }



    const handleSubmit = async () => {
        const userData = { username, password, email };
        if (!isUsernameValid || !isPasswordValid || !isEmailValid)
        {
            setErrorMessage("Invalid input data");
            return;
        }
        setShowAlert(true);
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
                }, {
                    text: 'OK',
                    handler: () => {
                        fetch('api/places/auth/register', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(userData)
                        })
                            .then(response => {
                                console.log(userData);
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                //return response.json();
                            })
                            .then(data => {
                                history.push("/login");
                            })
                            .catch(error => {
                                // afiseaza un mesaj de eroare sau executa o alta actiune
                                console.error('There was an error registering the user:', error);
                            });
                        console.log('Registration confirmed');
                    }
                }
            ]
        });

        await alert.present();

    };
    return(


    <IonPage className="ion-page3 background-image" >
            <IonHeader>
                <IonToolbar className="ion-toolbar">
                    <IonTitle>Create an account</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-content">
                <form>
                    <IonLabel className="register-form-label">
                        Username:
                        <IonInput className = "username-input"
                                  type="text"
                                  placeholder = "username"
                                  value={username}
                                  onIonFocus={(e) => {
                                    usernameInputStatus = true;
                                    validateUsername(username || '');
                                  }}
                                  onIonChange={(e) => {
                                      setState({
                                          ...state,
                                          username: e.detail.value || ''
                                      });
                                      if (usernameInputStatus) {
                                          validateUsername(e.detail.value || '');
                                      }
                                  }}
                                  onIonBlur = {() =>{
                                        usernameInputStatus = false;
                                        setUsernameErrorMessage('');
                                  }}
                        />
                        {!isUsernameValid && (
                            <IonLabel className="register-error-label">{usernameErrorMessage}</IonLabel>)}
                    </IonLabel>
                    <IonLabel className="register-form-label">
                        Password:
                        <IonInput className = "password-input"
                                  type="password"
                                  placeholder = "password"
                                  value={password}
                                  onIonFocus={(e) => {
                                    passwordInputStatus = true;
                                    validatePassword(password || '');
                                  }}
                                  onIonChange={(e) => {
                                      setState({
                                          ...state,
                                          password: e.detail.value || ''
                                      });
                                      if (passwordInputStatus) {
                                          validatePassword(e.detail.value || '');
                                      }
                                  }}
                                  onIonBlur = {() =>{
                                      passwordInputStatus = false;
                                      setPasswordErrorMessage('');
                                  }}

                        />
                        {!isPasswordValid && (
                            <IonLabel className="register-error-label">{passwordErrorMessage}</IonLabel>)}
                    </IonLabel>
                    <IonLabel className="register-form-label">
                        Email:
                        <IonInput className = "email-input"
                                  type="text"
                                  placeholder = "email"
                                  value={email}
                                  onIonFocus={(e) => {
                                      emailInputStatus = true;
                                      validateEmail(email || '');
                                  }}
                                  onIonChange={(e) => {
                                      setState({
                                          ...state,
                                          email: e.detail.value || ''
                                      });
                                      if (emailInputStatus) {
                                          validateEmail(e.detail.value || '');
                                      }
                                  }}
                                  onIonBlur = {() =>{
                                      emailInputStatus = false;
                                      setEmailErrorMessage('');
                                  }}

                        />
                        {!isEmailValid && (
                            <IonLabel className="register-error-label">{emailErrorMessage}</IonLabel>)}
                    </IonLabel>
                    <IonButton className="register-button" onClick={handleSubmit} color="secondary">Create account</IonButton>
                    {errorMessage &&(
                        <span style={{color: 'red'}}>{errorMessage}</span>
                    )}
                    <br/>
                    <IonRouterLink className="sign-in-link" routerLink={`/login`}>
                        Back to sign in
                    </IonRouterLink>
                </form>
            </IonContent>
        </IonPage>

    );
}