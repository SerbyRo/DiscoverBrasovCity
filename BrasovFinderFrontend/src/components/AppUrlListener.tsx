import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import {baseUrl} from "../core";

const referenceUrl = `http://${baseUrl}`

const AppUrlListener: React.FC<any> = () => {
    let history = useHistory();
    useEffect(() => {
        App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
            const slug = event.url.replace(referenceUrl, "");
            if (slug) {
                history.push(slug);
            }
            // If no match, do nothing - let regular routing
            // logic take over
        });
    }, []);

    return null;
};

export default AppUrlListener;