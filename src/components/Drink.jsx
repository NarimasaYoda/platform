import React from 'react'
import { Link } from "react-router-dom"
import Feed from './Feed'
import Drink2_Slide from './sub_components/Drink2_Slide'

const Drink = () => {
    return (
        <>
            <h1 className="title">お店 Information</h1>
            <hr />
            <button>新規の隠れ家</button>

            <Drink2_Slide />
            <Feed/>
            <p><Link to="/">Homeへ</Link></p>
        </>
    )
}

export default Drink
