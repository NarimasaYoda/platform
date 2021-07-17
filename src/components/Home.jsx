import React, { useState, useEffect } from 'react'
import { auth } from "../firebase";
import { Link, useHistory } from "react-router-dom"

import "../styles/style.css";
import Home_card from './Home_card';
import Icon_Feed from "./Icon_Feed";
import Logout from "./Logout"

const Home = () => {
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
            <h1 className="title">マチのPlatform</h1>

            {currentUser && //★ポイント uid取得後に可能となる
                (<Icon_Feed
                    DB="users"
                    STORAGE="images_users"
                    uid={currentUser.uid}
                    honorific ="さん"
                    greet ="、こんにちわ"
                />)
            }
            <div className="home">
                <div className="items">
                    <p className="comment0"><Link to="/drink">飲みに行く</Link></p>
                    <p className="comment0"><Link to="/event">イベント情報</Link></p>
                    <p className="comment0"><Link to="/conversation">メッセージ</Link></p>
                </div>

                <div className="info">
                    <Home_card DB="homes"/>
                </div>
            </div>

            <hr />

            <button onClick={() => history.push("/login")}>ユーザログイン</button>
            <Logout JumpTo = "/"/>
            <button onClick={() => history.push("/admin")}>管理者画面</button>
        </>
    )
}

export default Home
