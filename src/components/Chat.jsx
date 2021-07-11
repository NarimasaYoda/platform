import React, { useState, useEffect } from 'react'
import { auth } from "../firebase";
import { Link, useHistory, Route, withRouter } from "react-router-dom"
import Img_Chat from "../images/chat.png";

import Icon_Feed from './Icon_Feed';
import Logout from "./Logout";
import Chat_Icons from "./Chat_Icons"
// import Conversations from "./Conversations"

const Chat = () => {
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
            <button onClick={() => history.push("/loginDrink")}>ユーザログイン</button>
            <Logout JumpTo="/" />
            {currentUser && //★ポイント uid取得後に可能となる
                (<Icon_Feed
                    DB="users"
                    STORAGE="images_users"
                    uid={currentUser.uid}
                />)
            }
            <hr />
            <Link to="/">Homeへ</Link><span>/</span>
            <Link to="/conversations">Conversationへ</Link>
            <hr/>
            <img src={Img_Chat} alt="" className="Chat_image" />
            <hr />

            {currentUser &&
                (<Chat_Icons
                    DB="users"
                    uid={currentUser.uid}
                />)
            }
            {/* {!currentUser &&
                (<Chat_Icons
                    DB="users"
                />)
            }//※※※これは入れてはいけない */} 

        </div>
    )
}

export default Chat
