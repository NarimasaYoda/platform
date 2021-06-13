import React from 'react'
import { Link } from "react-router-dom"
import Drink_Slide from './Drink_Slide'
import Drink_Feed from './Drink_Feed'
import Drink_TweetInput from './Drink_TweetInput'

const Drink = () => {
    return (
        <>
            <h1 className="title">お店 Information</h1>
            <hr />
            <button>新規の隠れ家</button>

            {/* <Drink2_Slide /> */}
            <Drink_Slide/>
            <hr/>
            <Drink_TweetInput/>
            <Drink_Feed/>

            
            <p><Link to="/">Homeへ</Link></p>
        </>
    )
}

export default Drink
