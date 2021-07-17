import React, { useState, useEffect } from 'react'
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { useHistory } from 'react-router-dom';
import Icon_Feed from "./Icon_Feed"
import Img_Chat from "../images/chat.png";

import Conversation_Post from "./Conversation_Post";
import Logout from "./Logout";

const Conversation_Feed = ({ uid, DB }) => {
    const [chatRooms, setChatRooms] = useState([{
        id: "",
        room_name: "",
        uid1: "",
        uid2: "",
        user1: "",
        user2: "",
        user1_image: "",
        user2_image: "",
        timestamp: null,
    }]);

    const [chatRooms1, setChatRooms1] = useState([{
        id: "",
        room_name: "",
        uid1: "",
        uid2: "",
        user1: "",
        user2: "",
        user1_image: "",
        user2_image: "",
        timestamp: null,
    }]);

    const [chatRooms2, setChatRooms2] = useState([{
        id: "",
        room_name: "",
        uid1: "",
        uid2: "",
        user1: "",
        user2: "",
        user1_image: "",
        user2_image: "",
        timestamp: null,
    }]);

    const getChatRoomsData1 = (uidInfo) => {
        const firebase = db
            .collection(DB)
            .where('uid1', '==', uidInfo)
            // .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) =>
                setChatRooms1(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        room_name: doc.data().room_name,
                        uid1: doc.data().uid1,
                        uid2: doc.data().uid2,
                        user1: doc.data().user1,
                        user2: doc.data().user2,
                        user1_image: doc.data().user1_image,
                        user2_image: doc.data().user2_image,
                        timestamp: doc.data().timestamp
                    }))
                )
            )
    }

    const getChatRoomsData2 = (uidInfo) => {
        const firebase = db
            .collection("chats")
            .where('uid2', '==', uidInfo)
            // .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) =>
                setChatRooms2(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        room_name: doc.data().room_name,
                        uid1: doc.data().uid1,
                        uid2: doc.data().uid2,
                        user1: doc.data().user1,
                        user2: doc.data().user2,
                        user1_image: doc.data().user1_image,
                        user2_image: doc.data().user2_image,
                        timestamp: doc.data().timestamp
                    }))
                )
            )
    }

    useEffect(() => {
        getChatRoomsData1(uid); //chatRoom1
        getChatRoomsData2(uid); //chatRoom2
    }, [])

    useEffect(() => {
        setChatRooms([...chatRooms1, ...chatRooms2])
    }, [chatRooms1, chatRooms2])

    // console.log(chatRooms1,"★chatRooms1")
    // console.log(chatRooms2, "★chatRooms2")
    console.log(chatRooms, "★chatRooms")

    return (
        <div>
            {chatRooms1.map((chatItem, index) => (
                <Conversation_Post
                    key={chatItem.id}
                    id={chatItem.id}

                    uid={uid}
                    DB={DB}
                    room_name={chatItem.room_name}
                    uid1={chatItem.uid1}
                    uid2={chatItem.uid2}
                    user1={chatItem.user1}
                    user2={chatItem.user2}
                    user1_image={chatItem.user1_image}
                    user2_image={chatItem.user2_image}
                    timestamp={chatItem.timestamp}
                />
            ))}
            {chatRooms2.map((chatItem, index) => (
                <Conversation_Post
                    key={chatItem.id}
                    id={chatItem.id}

                    uid={uid}
                    DB={DB}
                    room_name={chatItem.room_name}
                    uid1={chatItem.uid1}
                    uid2={chatItem.uid2}
                    user1={chatItem.user1}
                    user2={chatItem.user2}
                    user1_image={chatItem.user1_image}
                    user2_image={chatItem.user2_image}
                    timestamp={chatItem.timestamp}
                />
            ))}

        </div >
    )
}

export default Conversation_Feed
