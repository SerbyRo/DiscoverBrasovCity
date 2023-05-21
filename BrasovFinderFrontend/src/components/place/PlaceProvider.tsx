import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import {PlaceProps} from "./PlaceProps";
import {createPlace, getPlaces, updatePlace} from "./PlaceApi";
import {newWebSocket} from "../../todo/itemApi";
import {getLogger} from "../../core";
import {AuthContext} from "../auth";
import {useNetwork} from "../network/useNetwork";
const log = getLogger('PlaceProvider');


export type SavePlaceFunction = (place: PlaceProps) => Promise<any>;

export interface PlaceState {
    places?: PlaceProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    savePlace?: SavePlaceFunction,
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: PlaceState = {
    fetching: false,
    saving: false,
};



const FETCH_PLACES_STARTED = 'FETCH_PLACES_STARTED';
const FETCH_PLACES_SUCCEEDED = 'FETCH_PLACES_SUCCEEDED';
const FETCH_PLACES_FAILED = 'FETCH_PLACES_FAILED';
const SAVE_PLACE_STARTED = 'SAVE_PLACE_STARTED';
const SAVE_PLACE_SUCCEEDED = 'SAVE_PLACE_SUCCEEDED';
const SAVE_PLACE_FAILED = 'SAVE_PLACE_FAILED';

const reducer: (state: PlaceState, action: ActionProps) => PlaceState =
    (state, { type, payload }) => {
        switch (type) {
            case FETCH_PLACES_STARTED:
                return { ...state, fetching: true, fetchingError: null };
            case FETCH_PLACES_SUCCEEDED:
                return { ...state, places: payload.places, fetching: false };
            case FETCH_PLACES_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false };
            case SAVE_PLACE_STARTED:
                return { ...state, savingError: null, saving: true };
            case SAVE_PLACE_SUCCEEDED:
                const places = [...(state.places || [])];
                const place = payload.place;
                const index = places.findIndex(it => it.place_id === place.place_id);
                if (index === -1) {
                    places.splice(0, 0, place);
                } else {
                    places[index] = place;
                }
                return { ...state, places:places, saving: false };
            case SAVE_PLACE_FAILED:
                return { ...state, savingError: payload.error, saving: false };
            default:
                return state;
        }
    };

export const PlaceContext = React.createContext<PlaceState>(initialState);

interface PlaceProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const PlaceProvider: React.FC<PlaceProviderProps> = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { places, fetching, fetchingError, saving, savingError } = state;

    useEffect(getItemsEffect, [token]);
    useEffect(wsEffect, [token]);
    const savePlace = useCallback<SavePlaceFunction>(savePlaceCallback, [token]);
    const value = { places, fetching, fetchingError, saving, savingError, savePlace };
    return (
        <PlaceContext.Provider value={value}>
            {children}
        </PlaceContext.Provider>
    );

    async function fetchPlaces() {
        if (!token?.trim()) {
            return;
        }
        try {
            dispatch({type: FETCH_PLACES_STARTED});
            const places = await getPlaces(token);
            dispatch({type: FETCH_PLACES_SUCCEEDED, payload: {places: places}});
        } catch (error) {
            dispatch({type: FETCH_PLACES_FAILED, payload: {error}});
        }
    }

    function getItemsEffect() {
        fetchPlaces().then(_ => {
        });
    }

    async function savePlaceCallback(place: PlaceProps) {
            try {
                log('saveItem started');
                dispatch({ type: SAVE_PLACE_STARTED });
                const savedItem = await (place.place_id ? updatePlace(token, place) : createPlace(token, place));
                log('saveItem succeeded');
                dispatch({ type: SAVE_PLACE_SUCCEEDED, payload: { place: savedItem } });
            } catch (error) {
                log('saveItem failed');
                dispatch({ type: SAVE_PLACE_FAILED, payload: { error } });
            }


    }

    function wsEffect() {

        let canceled = false;
        log('wsEffect - connecting');
        let closeWebSocket: () => void;
        if (token?.trim()) {
            closeWebSocket = newWebSocket(token, message => {
                if (canceled) {
                    return;
                }
                const { type, payload: place } = message;
                log(`ws message, item ${type}`);
                if (type === 'created' || type === 'updated') {
                    dispatch({ type: SAVE_PLACE_SUCCEEDED, payload: { place:place } });
                }
            });
        }
        return () => {
            log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket?.();
        }
    }
};
