import React from 'react'
import { Link } from "react-router-dom"
import Test1 from './Test1'
import Test2 from './Test2'
import Test_Feed from './Test_Feed'
import Test_TweetInput from './Test_TweetInput'

const Test = () => {
    return (
        <div>
            <p><Link to="/">Homeへ</Link></p>
            <hr/>
            <Test1/>
            <hr/>
            <Test2/>
            <hr/>
            
            <Test_TweetInput/>
            <Test_Feed/>
        </div>
    )
}

export default Test
