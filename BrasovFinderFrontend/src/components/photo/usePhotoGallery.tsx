import {Camera} from '@capacitor/camera';
import {CameraPhoto,CameraResultType,CameraSource} from "@capacitor/camera";
import {Directory} from '@capacitor/filesystem';
import {useEffect, useState} from 'react';
import {Filesystem} from '@capacitor/filesystem';
import {Preferences} from '@capacitor/preferences';
import {deleteImage, getAllImages, uploadPhoto} from "../place/PlaceApi";
import {useCamera} from "../../utils/useCamera";
import {IonAlert} from "@ionic/react";
import {CapacitorException} from "@capacitor/core";
import React from 'react';
import {ImageProps} from "../place/ImageProps";

export interface Photo {
    filepath: string;
    webviewPath?: string;
}

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery(token: string|null = null, place_id:number |undefined=undefined) {
    const { getPhoto } = useCamera();
    const [photos, setPhotos] = useState<ImageProps[]>([]);
    const [showCancelAlert, setShowCancelAlert] = useState(false);
    let [savedImage,setSavedImage] = useState<ImageProps>();
    const takePhoto = async (name: string) => {
        try{
            const cameraPhoto = await getPhoto();

            if (token)
                 savedImage = await uploadPhoto(token, JSON.stringify({photo_path: cameraPhoto.base64String}),place_id??0)
            console.log("A adaugat imaginea" ,photos);
            const fileName = name + "=>" + new Date().getTime() + '.jpeg';
            const savedFileImage = await savePicture(cameraPhoto, fileName);
            const newPhotos = savedImage ? [...photos,savedImage] : [...photos];
            console.log("A ajuns aici "+ place_id + " si are numele " + cameraPhoto.base64String);
            setPhotos(newPhotos);
            console.log(savedImage);
            console.log(newPhotos);
            await set({
                key: PHOTO_STORAGE,
                value: JSON.stringify(newPhotos),
            });
        }catch (error){
            if (error instanceof CapacitorException) {
                // User cancelled the action
                setShowCancelAlert(true);
                return (
                    <IonAlert
                        isOpen={showCancelAlert}
                        onDidDismiss={() => setShowCancelAlert(false)}
                        header={'Atenție'}
                        message={'Nu s-a făcut nicio poză!'}
                        buttons={['OK']}
                    />
                );
            }
        }

    };

    const { deleteFile, readFile, writeFile } = Filesystem;
    const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
        const base64Data = photo.base64String!;
        await writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data
        });
        return {
            filepath: fileName,
            webviewPath: `data:image/jpeg;base64,${base64Data}`
        };
    };

    const { get, set } = Preferences;
    useEffect(() => {
        const loadSaved = async () => {
            if (typeof place_id !== "undefined"){
                const photosString = await getAllImages(token??'',place_id??0);
                console.log(photosString);
                setPhotos(photosString);
            }

        };
        loadSaved();
    }, []);

    const deletePhoto = async (photo: ImageProps) => {
        deleteImage(token??'',place_id??0,photo.image_id??0)
            .then(() => {
                const newPhotos = photos.filter(photo1 => photo1 != photo);
                setPhotos(newPhotos);
            });
    };

    return {
        photos,
        takePhoto,
        deletePhoto,
    };
}
