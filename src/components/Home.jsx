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
            <hr />
            <div className="home">
                <div className="items">
                    <p><Link to="/drink">飲みに行く</Link></p>
                    <p><Link to="/event">イベント情報</Link></p>
                    <p><Link to="/chat">メッセージ</Link></p>
                    <p><Link to="/admin">管理者画面</Link></p>
                </div>

                <div className="info">
                    <Home_card DB="homes"/>
                </div>
            </div>

            <hr />
            {currentUser && //★ポイント uid取得後に可能となる
                (<Icon_Feed
                    DB="users"
                    STORAGE="images_users"
                    uid={currentUser.uid}
                />)
            }
            <button onClick={() => history.push("/login")}>ユーザログイン</button>
            <Logout JumpTo = "/"/>
            {/* <Logout JumpTo="login" />
            <p><Link to="/login">loginへ</Link></p> */}
            <p><Link to="/test">testへ</Link></p>
        </>
    )
}

export default Home
