import React from 'react'
import { Link } from "react-router-dom"

const Event = () => {
    return (
        <>
            <h1>Event</h1>

            <h1 className="title">イベント Information</h1>
            <hr/>
            <button>新規イベント投稿</button>
            
            <hr/>
            <div className="event">
                <div className="items">
                    <p>日時</p>
                    <p>情報</p>
                    <input type="text" />
                    <button>投稿</button>
                </div>

                <div className="items">
                    <p>日時</p>
                    <p>情報</p>
                    <input type="text" />
                    <button>投稿</button>
                </div>
                
            </div>

            <hr />
            <p><Link to="/">Homeへ</Link></p>
        </>
    )
}

export default Event
