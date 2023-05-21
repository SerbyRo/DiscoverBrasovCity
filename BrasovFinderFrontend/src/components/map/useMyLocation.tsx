import { useEffect, useState } from 'react';
import {Geolocation} from "@capacitor/geolocation";
interface MyLocation {
    position?: Geolocation;
    error?: Error;
}

export const useMyLocation = () => {
    const [state, setState] = useState<MyLocation>({});
    useEffect(watchMyLocation, []);
    return state;

    function watchMyLocation() {
        let cancelled = false;
        Geolocation.getCurrentPosition()
            .then((position:any) => updateMyPosition('current', position))
            .catch((error:any) => updateMyPosition('current',undefined, error));
        const callbackId = Geolocation.watchPosition({}, (position:any, error:any) => {
            updateMyPosition('watch', position, error);
        });
        return () => {
            cancelled = true;
            // @ts-ignore
            Geolocation.clearWatch({ id: callbackId });
        };

        function updateMyPosition(source: string, position?: Geolocation, error: any = undefined) {
            // console.log(source, position, error);
            if (!cancelled) {
                setState({ ...state, position: position || state.position, error });
            }
        }
    }
};


