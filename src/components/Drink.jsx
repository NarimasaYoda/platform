import React, { useState, useEffect } from 'react'
import { auth } from "../firebase";
import { Link, useHistory } from "react-router-dom"

import Drink_Slide from './Drink_Slide'
import Drink_TweetInput from './Drink_TweetInput'
import Drink_Feed from './Drink_Feed'

import Icon_Feed from './Icon_Feed'
import Logout from "./Logout"

const Drink = () => {
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
            <h1 className="title">お店 Information</h1>
            <hr />
            <p className="comment3">投稿時にはユーザ登録が必要です</p>

            <button onClick={() => history.push("/loginDrink")}>ユーザログイン</button>
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

            <Drink_Slide
                DB="pubs"
                STORAGE="images_pubs"
                STORAGE2="images_imairu"
                uid={currentUser.uid} />

            <hr />
            <Drink_TweetInput
                DB="drinks"
                STORAGE="images"
                uid={currentUser.uid} />
                
            <Drink_Feed
                DB="drinks"
                STORAGE="images"
                uid={currentUser.uid} />
        </>
    )
}

export default Drink
