import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import {AuthProvider, Login, PrivateRoute} from './components/auth';
import {Register} from "./components/register/Register";
import {ForgotPassword} from "./components/forgot-password/ForgotPassword";
import {ResetPassword} from "./components/forgot-password/ResetPassword";
import {Menu} from "./components/menu/Menu";
import PlaceList from "./components/place/PlaceList";
import {PlaceProvider} from "./components/place/PlaceProvider";
import EditPlace from "./components/place/EditPlace";
import MyAccount from "./components/myAccount/MyAccount";
import Location from "./components/location/Location";
import Help from "./components/help/Help";
import Toast from "./components/toast/Toast";


const App: React.FC = () => (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <AuthProvider>
            <Route path="/login" component={Login} exact={true}/>
              <Route path="/register" component={Register} exact={true}/>
              <Route path="/forgot-password" component={ForgotPassword} exact={true}/>
              <Route path="/reset-password/:token" component={ResetPassword} exact={true}/>
              <PrivateRoute path={"/home"} component={PlaceList} exact={true}/>
             <PrivateRoute component={EditPlace} path={"/place/:id"} exact={true}/>
              <PrivateRoute path={"/account"} component={MyAccount} exact={true}/>
              <PrivateRoute path={"/maps"} component={Location} exact={true}/>
              <PrivateRoute path={"/statistics"} component={Toast} exact={true}/>
              <PrivateRoute path={"/help"} component={Help} exact={true}/>
            <Route exact path="/" render={() => <Redirect to="/home"/>}/>
          </AuthProvider>

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
);

export default App;
