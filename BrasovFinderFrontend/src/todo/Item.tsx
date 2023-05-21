import React, { useCallback } from 'react';
import {IonDatetime, IonImg, IonItem, IonLabel, IonToggle} from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ name,boooked_date,visited,price, photoPath, _id, onEdit }) => {
  const handleEdit = useCallback(() => onEdit(_id), [_id, onEdit]);

  return (
    <IonItem onClick={handleEdit}>
      <IonLabel>{name}</IonLabel>
      <IonDatetime value={boooked_date.toString()}/>
      <IonToggle checked={visited}/>
      <IonLabel>{price}</IonLabel>
      <IonImg style={{width: "200px", height: "200px", margin: "0 auto"}} alt={"No photo"} src={photoPath}/>
    </IonItem>
  );
};

export default Item;

