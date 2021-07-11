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

            <button onClick={()=>history.push("/loginEvent")}>ユーザログイン</button>
            <Logout JumpTo = "/"/>

            <Link to="/">Homeへ</Link>

            {currentUser && //★ポイント uid取得後に可能となる
                (<Icon_Feed
                    DB="users"
                    STORAGE="images_users"
                    uid={currentUser.uid}
                />)
            }
           
            <hr />
            <div className="event">
                <Event_TweetInput
                    DB="events"
                    STORAGE="images" />

                <hr />
                <Event_Feed
                    DB="events"
                    STORAGE="images" />
            </div>
            <hr />

        </>
    )
}

export default Event
