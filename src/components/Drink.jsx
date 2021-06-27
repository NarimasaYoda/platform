import React, { useState, useEffect } from 'react'
import { auth } from "../firebase";
import { Link } from "react-router-dom"

import Drink_Slide from './Drink_Slide'
import Drink_TweetInput from './Drink_TweetInput'
import Drink_Feed from './Drink_Feed'

const Drink = (props) => {
    const [currentUser, setCurrentUser] = useState("")

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user == null) {
                setCurrentUser("")
            } else {
                setCurrentUser(user);
            }
        });
    }, [])

    // const uid = currentUser.uid
    console.log(currentUser, "currentUser")

    

    const moveToLogin = () => {
        props.history.push("/loginDrink")
    }

    return (
        <>
            <h1 className="title">お店 Information</h1>
            <hr />
            <p className="comment3">投稿時にはユーザ登録が必要です</p>

            <button onClick={()=>moveToLogin()}>ユーザログイン</button>
            
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
            <hr />

            {/* <button>新規の隠れ家</button> */}

            <Drink_Slide
                DB="pubs"
                STORAGE="images_pubs"
                uid={currentUser.uid} />
            {/* <Drink_Slide2 /> */}
            {/* <Drink_Slide3/> */}

            <hr />
            <Drink_TweetInput
                DB="drinks"
                STORAGE="images"
                uid={currentUser.uid} />
            <Drink_Feed
                DB="drinks"
                STORAGE="images"
                uid={currentUser.uid} />


            <p><Link to="/">Homeへ</Link></p>
        </>
    )
}

export default Drink
