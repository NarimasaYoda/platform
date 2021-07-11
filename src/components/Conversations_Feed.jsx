import React, { useState, useEffect } from 'react'
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { useHistory } from 'react-router-dom';
import Icon_Feed from "./Icon_Feed"
import Img_Chat from "../images/chat.png";

import Conversations_Post_test from "./old/Conversations_Post_test";
import Conversations_Post from "./Conversations_Post";
import Logout from "./Logout";

const Conversations_Feed = ({ uid, DB }) => {

    const [chatRooms1, setChatRooms1] = useState([{
        id: "",
        room_name: "",
        uid1: "",
        user1: "",
        user1_image: "",
        uid2: "",
        user2: "",
        user2_image: "",
        timestamp: null,
    }]);

    console.log(uid, DB)

    // const [chatRooms2, setChatRooms2] = useState([{
    //     id: "",
    //     room_name: "",
    //     uid1: "",
    //     user1: "",
    //     user1_image: "",
    //     uid2: "",
    //     user2: "",
    //     user2_image: "",
    //     timestamp: null,
    // }]);

    const getChatRoomsData1 = (uidInfo) => {
        const firebase = db
            .collection(DB)
            .where('uid1', '==', uidInfo) //★★★まとめられないか
            // .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) =>
                setChatRooms1(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        room_name: doc.data().room_name,
                        uid1: doc.data().uid1,
                        user1: doc.data().user1,
                        user1_image: doc.data().user1_image,
                        uid2: doc.data().uid2,
                        user2: doc.data().user2,
                        user2_image: doc.data().user2_image,
                        timestamp: doc.data().timestamp
                    }))
                )
            )
    }

    // const getChatRoomsData2 = (uidInfo) => {
    //     const firebase = db
    //         .collection("chats")
    //         .where('uid2', '==', uidInfo) //★まとめられないか
    //         // .orderBy('timestamp', 'asc')
    //         .onSnapshot((snapshot) =>
    //             setChatRooms2(
    //                 snapshot.docs.map((doc) => ({
    //                     id: doc.id,
    //                     room_name: doc.data().room_name,
    //                     uid1: doc.data().uid1,
    //                     user1: doc.data().user1,
    //                     user1_image: doc.data().user1_image,
    //                     uid2: doc.data().uid2,
    //                     user2: doc.data().user2,
    //                     user2_image: doc.data().user2_image,
    //                     timestamp: doc.data().timestamp
    //                 }))
    //             )
    //         )
    // }

    useEffect(() => {
        getChatRoomsData1(uid);
        // getChatRoomsData2(uid);
    }, [])

    console.log(chatRooms1, chatRooms1[0], chatRooms1[0].user1)


    return (
        <div>
            {chatRooms1.map((chatItem) => (
                <Conversations_Post

                    key={chatItem.id}

                    id={chatItem.id}

                    room_name={chatItem.room_name}
                    user1={chatItem.user1}
                    user1_image={chatItem.user1_image}
                    uid2={chatItem.uid2}
                    user2={chatItem.user2}
                    user2_image={chatItem.user_image2}
                    timestamp={chatItem.timestamp}

                    DB={DB}
                />
            ))}


            {/* {chatRooms2.map((chatItem) => (
                <Conversations_Post
                    key={chatItem.id}

                    id={chatItem.id}

                    room_name={chatItem.room_name}
                    user1={uid}
                    user1_image={chatItem.user1_image}
                    uid2={chatItem.uid2}
                    user2={chatItem.user2}
                    user2_image={chatItem.user_image2}
                    timestamp={chatItem.timestamp}

                    DB={DB}
                />
            ))} */}

        </div >
    )
}

export default Conversations_Feed
