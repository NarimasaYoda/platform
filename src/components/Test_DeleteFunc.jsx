import React from 'react'
import { storage, db } from "../firebase";

export const deleteData = (id,image) => {
    db.collection("tests").doc(id).delete();
    storage.ref(`images/${image}`).delete();
}





