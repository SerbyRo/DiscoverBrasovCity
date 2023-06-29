import axios from 'axios';
import {authConfig, baseUrl, config, withLogs} from '../../core';
import {UserProps} from "../place/UserProps";

const authUrl = `http://${baseUrl}/api/places/auth/authenticate`;
const userUrl = `http://${baseUrl}/api/places/auth`;
export interface AuthProps {
  token: string;
}

export const login: (username?: string, password?: string) => Promise<AuthProps> = (username, password) => {
    console.log(authUrl);
  return withLogs(axios.post(authUrl, { username, password }, config), 'login');
}

export const findUserByToken : (token: string) => Promise<UserProps> =
    (token) => {
      return withLogs(axios.get(`${userUrl}/user/${token}`,config),'findUserByToken');
    }




