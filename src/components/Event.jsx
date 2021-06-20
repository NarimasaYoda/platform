import React from 'react'
import { auth } from "../firebase";
import { Link } from "react-router-dom"

import Event_TweetInput from "./Event_TweetInput"
import Event_Feed from "./Event_Feed"

const Event = (props) => {
    return (
        <>
            <h1 className="title">イベント Information</h1>
            <hr />
            <p className="comment3">イベント投稿時にはユーザ登録が必要です</p>
            <button
                onClick={async () => {
                    try {
                        await auth.signOut();
                        props.history.push("/"); //ここでログアウトして飛ばしたいページに戻す
                    } catch (error) {
                        alert(error.message);
                    }
                }}
            >
                ユーザログアウト
            </button>
            <Link to="/">Homeへ</Link>
           
            {/* <p><Link to="/eventTweet">新規イベント投稿</Link></p> */}

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
