import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import {
    IonAlert,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonLabel,
    IonLoading,
    IonPage, IonRouterLink,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { AuthContext } from './AuthProvider';
import { getLogger } from '../../core';
import './css/Login.css'
import '../register/css/Register.css'
import {UserProps} from "../place/UserProps";
const log = getLogger('Login');

interface LoginState {
  username?: string;
  password?: string;
  email?: string;
  personal_score?: number;
}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);
  const [state, setState] = useState<LoginState>({});
  const { username, password} = state;

  const handleLogin = async () => {
    log('handleLogin...');
      if (login === undefined)
      {
          console.log("loginu ii undefined");
      }
    login?.(username, password);
  };
  log('render');
  if (isAuthenticated) {
    return <Redirect to={{ pathname: `/home` }} />
  }
  return (
    <IonPage className="ion-page1 background-image1">
      <IonHeader>
        <IonToolbar className="ion-toolbar1">
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-content1">
          <form>
              <IonLabel>
        <IonInput className="username-input1"
          placeholder="Username"
          value={username}
          type ="text"
          onIonChange={e => setState({
            ...state,
            username: e.detail.value || ''
          })}/>
              </IonLabel>
              <IonLabel>
        <IonInput className="password-input1"
          placeholder="Password"
          value={password}
          type = "password"
          onIonChange={e => setState({
            ...state,
            password: e.detail.value || ''
          })}/>
              </IonLabel>
        <IonLoading isOpen={isAuthenticating}/>
        {authenticationError && (
            <IonAlert
                isOpen
                header="Warning"
                subHeader="Invalid credentials"
                message="Please try again"
                buttons={['OK']}
            ></IonAlert>
        )}  <br/>
              <br/>
              <IonRouterLink className="forgot-password-link" routerLink={`/forgot-password`}>
                  Forgot Password?
              </IonRouterLink>
        <IonButton className="login-button" onClick={handleLogin}>Login</IonButton>
              <IonLabel>
                  <IonTitle className="label1">Don't you have an account? Please register</IonTitle>
              </IonLabel>
          <IonButton className="register-button1" routerLink="/register" color="success">Register</IonButton>
          </form>
      </IonContent>
    </IonPage>
  );
};
