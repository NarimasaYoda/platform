import React from 'react'
import { auth } from "../firebase";
import { Link } from "react-router-dom"

import Drink_Slide from './Drink_Slide'
import Drink_Slide2 from './Drink_Slide2'
import Drink_Slide3 from './Drink_Slide3'

import Drink_TweetInput from './Drink_TweetInput'
import Drink_Feed from './Drink_Feed'

const Drink = (props) => {
    return (
        <>
            <h1 className="title">お店 Information</h1>
            <hr />
            <p className="comment3">投稿時にはユーザ登録が必要です</p>
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

            <Drink_Slide />
            <Drink_Slide2 />
            {/* <Drink_Slide3/> */}

            <hr />
            <Drink_TweetInput
                DB="drinks"
                STORAGE="images" />
            <Drink_Feed
                DB="drinks"
                STORAGE="images" />


            <p><Link to="/">Homeへ</Link></p>
        </>
    )
}

export default Drink
