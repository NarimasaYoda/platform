import React from 'react'
import { Link } from "react-router-dom"

const Drink = () => {
    return (
        <>
            <h1>Drink</h1>

            <h1 className="title">お店 Information</h1>
            <hr/>
            <button>新規の隠れ家</button>
            
            <hr/>
            <div className="drink">
                <div className="items">
                    <p>店</p>
                    <p>情報</p>
                    <input type="text" />
                    <button>投稿</button>
                </div>

                <div className="items">
                    <p>店</p>
                    <p>情報</p>
                    <input type="text" />
                    <button>投稿</button>
                </div>

                <div className="items">
                    <p>店</p>
                    <p>情報</p>
                    <input type="text" />
                    <button>投稿</button>
                </div>

                <div className="items">
                    <p>店</p>
                    <p>情報</p>
                    <input type="text" />
                    <button>投稿</button>
                </div>

                <div className="items">
                    <p>店</p>
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

export default Drink
