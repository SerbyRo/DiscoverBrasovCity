import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../../core';
import { login as loginApi } from './authApi';
import { Preferences} from "@capacitor/preferences";

const log = getLogger('AuthProvider');

type LoginFn = (username?: string, password?: string) => void;
type LogoutFn = () => void;


const Storage = Preferences;

export interface AuthState {
  authenticationError: Error | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  login?: LoginFn;
  logout? : LogoutFn;
  pendingAuthentication?: boolean;
  username?: string;
  password?: string;
  token: string;
  tokenFound: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: false,
  authenticationError: null,
  pendingAuthentication: false,
  token: '',
  tokenFound:false,
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
  children: PropTypes.ReactNodeLike,
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const { isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, token,tokenFound } = state;
  const login = useCallback<LoginFn>(loginCallback, []);
  const logout = useCallback<LogoutFn>(logoutCallBack, []);
  useEffect(authenticationEffect, [pendingAuthentication]);
  const value = { isAuthenticated, login, logout, isAuthenticating, authenticationError, token,tokenFound};
  log('render');
  useEffect(() => {
    async function checkForToken() {
      if (tokenFound)
        return

      const {keys} = await Storage.keys();
      if (keys.indexOf("token") !== -1) {
        const token = await Storage.get({ key: 'token' });
        setState({
          ...state,
          token: token.value!!,
          tokenFound: true,
          pendingAuthentication: false,
          isAuthenticated: true,
          isAuthenticating: false,
        })
      }
    }
    checkForToken()
  }, [state, tokenFound])
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

  function loginCallback(username?: string, password?: string): void {
    log('login');
    setState({
      ...state,
      pendingAuthentication: true,
      username,
      password
    });
  }

  function logoutCallBack() {
    Storage.remove({key: 'token'})
    setState({
      ...state,
      token: '',
      isAuthenticated: false,
      tokenFound: false
    })
  }

  function authenticationEffect() {
    let canceled = false;
    authenticate();
    return () => {
      canceled = true;
    }

    async function authenticate() {

      var tokenStorage = await Storage.get({key: "token"});
      if (tokenStorage.value) {
        setState({
          ...state,
          token: tokenStorage.value,
          pendingAuthentication: false,
          isAuthenticated: true,
          isAuthenticating: false,
        });
      }

      if (!pendingAuthentication) {
        log('authenticate, !pendingAuthentication, return');
        return;
      }
      try {
        log('authenticate...');
        setState({
          ...state,
          isAuthenticating: true,
        });
        const { username, password } = state;
        const { token } = await loginApi(username, password);
        if (canceled) {
          return;
        }
        log('authenticate succeeded');

        await Storage.set({
          key: 'token',
          value: token
        });

        setState({
          ...state,
          token,
          pendingAuthentication: false,
          isAuthenticated: true,
          isAuthenticating: false,
        });
      } catch (error) {
        if (canceled) {
          return;
        }
        log('authenticate failed');
        setState({
          ...state,
          authenticationError: error,
          pendingAuthentication: false,
          isAuthenticating: false,
        });
      }
    }
  }
};
