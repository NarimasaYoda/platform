import React from 'react'
import { Link, useHistory } from "react-router-dom"
import { storage, db, auth } from "../firebase";
// import TinderCard from 'react-tinder-card'

import "../styles/style.css";
import Home_card from './Home_card';

const Home = () => {

    const onSwipe = (direction) => {
        console.log('You swiped: ' + direction)
    }
    const onCardLeftScreen = (myIdentifier) => {
        console.log(myIdentifier + ' left the screen')
    }

    const history = useHistory()

    return (
        <>
            <h1 className="title">マチのPlatform</h1>
            <hr />
            <div className="home">
                <div className="items">
                    <p><Link to="/drink">飲みに行く</Link></p>
                    <p><Link to="/event">イベント情報</Link></p>
                    <p><Link to="/admin">管理者画面</Link></p>
                </div>

                <div className="info">
                    <Home_card />
                </div>
            </div>

            <hr />
            <button
                onClick={async () => {
                    try {
                        await auth.signOut();
                        history.push("login"); //ここでログアウトして飛ばしたいページに戻す
                    } catch (error) {
                        alert(error.message);
                    }
                }}
            >
                ユーザログアウト
            </button>
            <p><Link to="/login">loginへ</Link></p>
            <p><Link to="/test">testへ</Link></p>
        </>
    )
}

export default Home
