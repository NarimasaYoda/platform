import React, { useState, useEffect } from 'react'
import { auth } from "../firebase";
import { Link, useHistory } from "react-router-dom"

import Drink_Slide from './Drink_Slide'
import Drink_TweetInput from './Drink_TweetInput'
import Drink_Feed from './Drink_Feed'

import Icon_Feed from './Icon_Feed'
import Icon_Feed_2 from './Icon_Feed_2'

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

    console.log(currentUser, "currentUser")

    const history = useHistory()

    const moveToLogin = () => {
        history.push("/loginDrink")
    }

    return (
        <>
            <h1 className="title">お店 Information</h1>
            <hr />
            <p className="comment3">投稿時にはユーザ登録が必要です</p>

            <button onClick={() => moveToLogin()}>ユーザログイン</button>

            <button
                onClick={async () => {
                    try {
                        await auth.signOut();
                        history.push("/"); //ここでログアウトして飛ばしたいページに戻す
                    } catch (error) {
                        alert(error.message);
                    }
                }}
            >
                ユーザログアウト
            </button>
            <Link to="/">Homeへ</Link>

            <Icon_Feed
                DB="users"
                STORAGE="images_users"
            // uid={currentUser.uid}
            />

            {/* ★ここができない。 */}
            <Icon_Feed_2
                DB="users"
                STORAGE="images_users"
            // uid={currentUser.uid}
            /> 
            {/* ★ここができない。 */}

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
