import {authConfig, baseUrl, withLogs} from "../../core";
import {PlaceProps} from "./PlaceProps";
import axios from "axios";
import {ItemProps} from "../../todo/ItemProps";
import {PlaceState} from "./PlaceProvider";
import place from "./Place";
import {ImageProps} from "./ImageProps";
import {FeedbackProps} from "./FeedbackProps";
import {logoTiktok} from "ionicons/icons";
import {UserProps} from "./UserProps";
import {VisitProps} from "./VisitProps";
import {useState} from "react";
const placeUrl = `http://${baseUrl}/api/places`;

export const getPlaces : (token:string) => Promise<PlaceProps[]> = (token) => {
    return withLogs(axios.get(`${placeUrl}`,authConfig(token)),'getPlaces');
}

export const findPlaceById : (token: string,place_id:number) => Promise<PlaceProps> =
    (token,place_id) =>{
    return withLogs(axios.get(`${placeUrl}/${place_id}`,authConfig(token)),'findPlaceById');
}

export const findVisitByUserIdAndPlaceId: (token:string,place_id:number,user_id:number) => Promise<VisitProps> =
    (token,place_id,user_id) => {
        return withLogs(axios.get(`${placeUrl}/visits/${place_id}/${user_id}`,authConfig(token)),'findVisitByPlaceIdAndUserId');
    }

export const findFeedbackByUserIdAndPlaceId: (token:string,place_id:number,user_id:number) => Promise<FeedbackProps> =
    (token,place_id,user_id) => {
        return withLogs(axios.get(`${placeUrl}/feedbacks/${place_id}/${user_id}`,authConfig(token)),'findFeedbackByPlaceIdAndUserId');
    }

export const deletePlace : (token: string, place_id: number) => Promise<PlaceProps[]> = (token,place_id) =>{
    return withLogs(axios.delete(`${placeUrl}/${place_id}`, authConfig(token)), 'deletePlace')
}

export const uploadPhoto: (token: string, photo: string, place_id: number) => Promise<ImageProps> = (token, photo, place_id) => {
    return withLogs(axios.post(`${placeUrl}/${place_id}/images`, photo, authConfig(token)),'uploadPhoto')
}

export const deleteImage : (token: string, place_id:number,image_id:number) =>Promise<ImageProps[]> = (token,place_id,image_id) => {
    return withLogs(axios.delete(`${placeUrl}/${place_id}/images/${image_id}`,authConfig(token)),'deleteImage');
}

export const deleteFeedback: (token: string, feedback_id: number) => Promise<FeedbackProps[]> = (token, feedback_id) => {
    return withLogs(axios.delete(`${placeUrl}/feedbacks/delete/${feedback_id}`,authConfig(token)),'deleteFeedback');
}

export const deleteVisit: (token: string, visit_id: number) => Promise<VisitProps[]> = (token, visit_id) => {
    return withLogs(axios.delete(`${placeUrl}/visits/delete/${visit_id}`,authConfig(token)),'deleteVisit');
}

export const findFirstImageById : (token: string,place_id:number) => Promise<ImageProps> = (token,place_id) => {
    return withLogs(axios.get(`${placeUrl}/${place_id}/imagesOne`,authConfig(token)),'findFirstImageById');
}

export const getAllImages: (token: string,place_id:number) => Promise<ImageProps[]> = (token,place_id) => {
    return withLogs(axios.get(`${placeUrl}/${place_id}/images`,authConfig(token)),'getAllImages');
}

export const getAllFeedbacksByPlace: (token: string, place_id:number) => Promise<FeedbackProps[]> = (token, place_id) => {
    return withLogs(axios.get(`${placeUrl}/feedbacks/place/${place_id}`,authConfig(token)),'getAllFeedbacksByPlaceId');
}

export const getAllFeedbacksByUser: (token: string, user_id: number) => Promise<FeedbackProps[]> = (token, user_id) =>{
    return withLogs(axios.get(`${placeUrl}/feedbacks/user/${user_id}`,authConfig(token)),'getAllFeedbacksByUserId');
}

export const findAllPlacesByUserId : (token: string, user_id: number) => Promise<VisitProps[]> =(token,user_id) => {
    return withLogs(axios.get(`${placeUrl}/auth/${user_id}/visitsList`,authConfig(token)),'getAllPlacesByUserId');
}


export const createPlace: (token: string, place: PlaceProps) => Promise<PlaceProps[]> = (token, place) => {
    return withLogs(axios.post(placeUrl, place, authConfig(token)), 'createPlace');
}

export const addFeedback: (token: string, feedback: FeedbackProps) => Promise<FeedbackProps[]> = (token, feedback) => {
    return withLogs(axios.post(`${placeUrl}/feedbacks`,feedback,authConfig(token)),'createFeedback');
}

export const addVisit: (token: string, visit:VisitProps) => Promise<VisitProps[]> = (token, visit) =>{
    return withLogs(axios.post(`${placeUrl}/visits`,visit,authConfig(token)),'createVisit');
}

export const updatePlace: (token: string, place: PlaceProps) => Promise<PlaceProps[]> = (token, place) => {
    return withLogs(axios.put(`${placeUrl}/${place.place_id}`, place, authConfig(token)), 'updatePlace');
}