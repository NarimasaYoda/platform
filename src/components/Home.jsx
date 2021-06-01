import React from 'react'
import { Link } from "react-router-dom"

import "../styles/style.css";


const Home = () => {
    return (
        <>
            <h1 className="title">マチのPlatform</h1>
            <hr />

            <div className="home">
                <div className="items">
                    <p><Link to="/drink">飲みに行く</Link></p>
                    <p><Link to="/register">登録</Link></p>
                    <p><Link to="/event">イベント情報</Link></p>
                </div>
                <div className="info">
                    SNS情報を抽出
                </div>
            </div>

            <hr />
            <p><Link to="/register">registerへ</Link></p>
            <p><Link to="/drink">drinkへ</Link></p>
        </>
    )
}

export default Home
