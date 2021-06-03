import React from 'react'
import { Link } from "react-router-dom"
import Test1 from './Test1'
import Test_Feed from './Test_Feed'

const Test = () => {
    return (
        <div>
            <p><Link to="/">Homeへ</Link></p>
            <hr/>
            <Test1/>
            <Test_Feed/>
        </div>
    )
}

export default Test
