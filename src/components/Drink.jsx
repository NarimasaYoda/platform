import React from 'react'
import { Link } from "react-router-dom"
import Drink2_Slide from './sub_components/Drink2_Slide'

const Drink = () => {
    return (
        <>
            <h1>Drink</h1>

            <h1 className="title">お店 Information</h1>
            <hr />
            <button>新規の隠れ家</button>

            <Drink2_Slide />


            <p><Link to="/">Homeへ</Link></p>
        </>
    )
}

export default Drink
