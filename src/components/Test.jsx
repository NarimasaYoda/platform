import React from 'react'
import { Link } from "react-router-dom"
import Test1 from './Test1'
import Test2 from './Test2'
import Test_Feed from './Test_Feed'
import Test_TweetInput from './Test_TweetInput'
// import Test_TweetInput_1 from './Test_TweetInput_1'
// import Slide_Feed from './old/Slide_Feed'
import Test_Drink_Slide from './Test_Drink_Slide'
// import Test_Modal from './Test_Modal'
// import Drink_Now from './Drink_Now'


const Test = () => {
    return (
        <div>
            <p><Link to="/">Homeへ</Link></p>
            <hr />
            {/* <Test1/> */}
            {/* <Test2/> */}
            {/* <Test_TweetInput
                DB="tests"
                STORAGE="image_tests"
            />
            <Test_Feed
                DB="tests"
                STORAGE="image_tests" 
            /> */}
            {/* <Slide_Feed
                DB="pubs"
                STORAGE="image_pubs"
            /> */}
            <Test_Drink_Slide
                DB="pubs"
                STORAGE="image_pubs"
            />
            {/* <Test_Modal /> */}
            {/* <Drink_Now
                id="D0P1oVkUP692O2ONajaq"
                DB="pubs"
                STORAGE="image_pubs"
            /> */}


        </div>
    )
}

export default Test
