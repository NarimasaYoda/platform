import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { storage, db, auth } from "../../firebase";

export const toBlobFunction = (base64) => {
    const bin = atob(base64.replace(/^.*,/, ''));
    const buffer = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    // Blobを作成
    try {
        var blob = new Blob([buffer.buffer], {
            type: 'image/png'
        });
    } catch (e) {
        return false;
    }
    return blob;
}

export const getModalStyle = (top, left) => {
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

export const createChatRoom = (DB, user1, uid1, user1_image, user2, uid2, user2_image) => {
    db.collection(DB).add({
        room_name: uid1 + uid2,
        user1: user1,
        uid1: uid1,
        user1_image: user1_image,
        user2: user2,
        uid2: uid2,
        user2_image: user2_image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
}