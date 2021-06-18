import React from 'react'
import { Link } from "react-router-dom"
import Test1 from './Test1'
import Test2 from './Test2'
import Test_Feed from './Test_Feed'
import Test_TweetInput from './Test_TweetInput'
// import Test_TweetInput_1 from './Test_TweetInput_1'

const Test = () => {
    return (
        <div>
            <p><Link to="/">Homeへ</Link></p>
            <hr />
            {/* <Test1/> */}
            {/* <hr/> */}
            {/* <Test2/> */}
            {/* <hr/> */}
            <hr />
            <hr />
            <Test_TweetInput
                DB="tests"
                STORAGE="image_tests"
            />
            <Test_Feed
                DB="tests"
                STORAGE="image_tests" 
            />
        </div>
    )
}

export default Test
