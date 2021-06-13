import React from 'react'
import { Link } from "react-router-dom"
import Event_TweetInput from "./Event_TweetInput"
import Event_Feed from "./Event_Feed"



const Event = () => {
    return (
        <>
            <h1 className="title">イベント Information</h1>
            <hr />
            <button>新規イベント投稿</button>

            <hr />
            <div className="event">
                <Event_TweetInput
                    DB="events"
                    STORAGE="images" />
                <hr />
                <Event_Feed
                    DB="events"
                    STORAGE="images" /></div>
            <hr />
            <p><Link to="/">Homeへ</Link></p>
        </>
    )
}

export default Event
