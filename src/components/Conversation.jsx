import React, { useState, useEffect } from 'react'
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { Link, useHistory, Route, withRouter } from "react-router-dom"
import Icon_Feed from "./Icon_Feed"
import Img_Chat from "../images/chat.png";

import Conversation_Feed from "./Conversation_Feed";

import Conversation_Button from "./Conversation_Button";
import Conversation_ButtonNext from "./Conversation_ButtonNext";
import Logout from "./Logout";

const Conversation = () => {
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

    return (
        <div>
            <h1 className="title">メッセージを送ろう</h1>
            <hr />
            <p className="comment3">投稿時にはユーザ登録が必要です</p>
            <button onClick={() => history.push("/login")}>ユーザログイン</button>
            <Logout JumpTo="/" />
            {currentUser && //★ポイント uid取得後に可能となる
                (<Icon_Feed
                    DB="users"
                    uid={currentUser.uid}
                    honorific="さん"
                // greet ="、こんにちわ"
                />)
            }
            <p className="comment1"><Link to="/">Home画面へ</Link></p>
            {/* <Link to="/chat">Chatへ</Link> */}

            <div className="conversation_area">
                <>
                    {currentUser &&
                        (<Conversation_Button
                            DB="users"
                            uid={currentUser.uid}
                        />)
                    }
                    {!currentUser && (<Conversation_ButtonNext />)}
                </>
                <div className="container">
                    <img src={Img_Chat} alt="" className="chat_image" />
                </div>
                <hr className="border_white" />

                {currentUser &&
                    (<Conversation_Feed
                        DB="chats"
                        uid={currentUser.uid}
                    />)
                }
            </div>

            <div className="conversation_area">

            </div>
        </div>
    )
}

export default Conversation
