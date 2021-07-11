import React, { useState, useEffect } from 'react'
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { Link, useHistory, Route, withRouter } from "react-router-dom"
import Icon_Feed from "./Icon_Feed"
import Img_Chat from "../images/chat.png";

import Conversations_Feed from "./Conversations_Feed";
import Conversations_Post from "./old/Conversations_Post_test";
import Conversations_Post_aa from "./Conversations_Post";
import Logout from "./Logout";

const Conversations = ({ user1, uid1, user2, uid2, index }) => {
    const [currentUser, setCurrentUser] = useState("")

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user === null) {
                setCurrentUser("")
            } else {
                setCurrentUser(user);
            }
        });
    }, [])

    const history = useHistory()

    // uid1 = currentUser.uid
    // uid1 = "30m1Td6ozRVBXja22WuwMxSzTui1"
    // uid2 = "30m1Td6ozRVBXja22WuwMxSzTui1"

    return (
        <div>
            <h1 className="title">メッセージを送ろう</h1>
            <hr />
            <p className="comment3">投稿時にはユーザ登録が必要です</p>
            <button onClick={() => history.push("/loginDrink")}>ユーザログイン</button>
            <Logout JumpTo="/" />
            現在のユーザ：
            {currentUser && //★ポイント uid取得後に可能となる
                (<Icon_Feed
                    DB="users"
                    uid={currentUser.uid}
                />)
            }
            <hr />
            <Link to="/">Homeへ</Link><span>/</span>
            <Link to="/chat">Chatへ</Link>
            <hr />
            <img src={Img_Chat} alt="" className="Chat_image" />
            <hr />

            {currentUser &&
                (<Conversations_Feed
                    DB="chats"
                    uid={currentUser.uid}
                />)
            }

        </div>
    )
}

export default Conversations
