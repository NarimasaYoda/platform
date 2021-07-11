import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { Link, useHistory, Route, withRouter } from "react-router-dom"

import Img from "../images/no_image.png";

import { createChatRoom } from "./Function/Functions"

const Chat_Icons = ({ uid, DB }) => {
    const [posts, setPosts] = useState([{
        id: "",
        admin: "",
        email: "",
        image: "",
        image_name: "",
        nickname: "",
        uid: "",
        timestamp: null,
    }]);

    const [currentUser, setCurrentUser] = useState([{
        nickname: "",
        image: "",
        id: "",
    }]);

    const [chatRooms, setChatRooms] = useState([{
        id: "",
        uid1: "",
        user1: "",
        user1_image: "",
        uid2: "",
        user2: "",
        user2_image: "",
        timestamp: null,
    }]);

    const [flag, setFlag] = useState(false);
    const [checkFlag, setCheckFlag] = useState(0);

    const getPostsData = () => {
        const firebase = db
            .collection(DB)
            // .where('uid', '==', uidInfo)
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) =>
                setPosts(
                    //data()はfirebaseで指定されたコード記載方法
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        admin: doc.data().admin,
                        email: doc.data().email,
                        image: doc.data().image,
                        image_name: doc.data().image_name,
                        nickname: doc.data().nickname,
                        uid: doc.data().uid,
                        timestamp: doc.data().timestamp
                    }))
                )
            )
    }

    const getCurrentUserData = (uidInfo) => {
        const firebase = db
            .collection(DB)
            .where('uid', '==', uidInfo)
            .onSnapshot((snapshot) =>
                setCurrentUser(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        image: doc.data().image,
                        nickname: doc.data().nickname,
                    }))
                )
            )
    }

    const getChatRoomsData = () => {
        const firebase = db
            .collection("chats")
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) =>
                setChatRooms(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
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

    useEffect(() => {
        getPostsData();
        getCurrentUserData(uid);
    }, [])

    useEffect(() => {
        getChatRoomsData();
    }, [flag])

    const history = useHistory()

    const windowOpenFunc = (index) => {
        setFlag(!flag)

        console.log(chatRooms)

        const user1 = currentUser[0].nickname
        const uid1 = uid
        const user1_image = currentUser[0].image
        const user2 = posts[index].nickname
        const uid2 = posts[index].uid
        const user2_image = posts[index].image

        console.log(user1)
        console.log(uid1)
        console.log(user1_image)
        console.log(user2, index)
        console.log(uid2, index)
        console.log(user2_image, index)

        let i_flag = 0
        for (let i = 0; i < chatRooms.length; i++) {
            (chatRooms[i].uid1 + chatRooms[i].uid2) === (uid1 + uid2) ? i_flag = i_flag + 1 : i_flag = i_flag;
            (chatRooms[i].uid1 + chatRooms[i].uid2) === (uid2 + uid1) ? i_flag = i_flag + 1 : i_flag = i_flag;
        }

        console.log(i_flag, "i_flag")

        if (!(uid1 === uid2)) {
            if (i_flag === 0) {
                createChatRoom("chats", user1, uid1, user1_image, user2, uid2, user2_image)
                i_flag = 0
            } else {
                // 画面を飛ばしたい
                i_flag = 0
            }
            history.push("/conversations")
        }
    }

    return (
        <div>

            <div className="imairu_">
                {posts && posts.map((postId, index) => (
                    // <Icon_Feed DB={DB} uid={postId.uid}/>

                    <div className="items">
                        {postId.image && <img src={postId.image} alt="" className="post_image" onClick={() => windowOpenFunc(index)} />}
                        {!postId.image && <img src={Img} alt="" className="post_image" onClick={() => windowOpenFunc(index)} />}
                        <span className="comment2">{postId.nickname}/{postId.uid}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Chat_Icons
