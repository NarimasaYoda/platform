import React, { useState, useEffect } from 'react'
import { auth } from "../firebase";
import { Link, useHistory } from "react-router-dom"

import Event_TweetInput from "./Event_TweetInput"
import Event_Feed from "./Event_Feed"
import Icon_Feed from './Icon_Feed'
import Logout from "./Logout"

const Event = () => {
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
        <>
            <h1 className="title">イベント Information</h1>
            <hr />
            <p className="comment3">投稿時にはユーザ登録が必要です</p>

            <button onClick={() => history.push("/loginEvent")}>ユーザログイン</button>
            <Logout JumpTo="/" />

            {currentUser && //★ポイント uid取得後に可能となる
                (<Icon_Feed
                    DB="users"
                    STORAGE="images_users"
                    uid={currentUser.uid}
                    honorific="さん"
                // greet ="、こんにちわ"
                />)
            }
            <p className="comment1"><Link to="/">Home画面へ</Link></p>
            
            <div className="event_area">
            <p className="comment0 center">FREE 投稿</p>
                <Event_TweetInput
                    DB="events"
                    STORAGE="images" />
                <Event_Feed
                    DB="events"
                    STORAGE="images" />
            </div>

        </>
    )
}

export default Event
