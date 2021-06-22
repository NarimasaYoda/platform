import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from "react-router-dom"

import Home from "./Home"
import Login from "./Login"
import LoginEvent from "./LoginEvent"
import LoginDrink from "./LoginDrink"

// import Register from "./Register"
import Drink from "./Drink"
import Event from "./Event"
// import EventTweet from "./EventTweet"
import Admin from "./Admin"
import AdminDrink from "./AdminDrink"
import Test from "./Test"

const Router = () => (
    <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/loginEvent" component={LoginEvent} />
        <Route path="/loginDrink" component={LoginDrink} />

        {/* <Route path="/register" component={Register} /> */}
        <Route path="/drink" component={Drink} />
        <Route path="/event" component={Event} />
        {/* <Route path="/eventTweet" component={EventTweet} /> */}
        <Route path="/admin" component={Admin} />
        <Route path="/adminDrink" component={AdminDrink} />
        <Route path="/test" component={Test} />
        {/* <Route path="/blog/:id" component={Blog} /> */}
        {/* <Route path="/sum/" component={Sum0} /> */}
        {/* <Route path="/sum/:num1/:num2" component={Sum} /> */}
    </BrowserRouter>
)

// const Sum0 = () => {
//     return (
//         <div>
//             <p>sum/*/* 複数の数値入力（Getメソッド方式）</p>
//             <p><Link to="/">Welcomeへ(Link機能)</Link></p>
//         </div>
//     )
// }

// const Blog = props => {
//     const { id } = props.match.params

//     console.log(props, "これ")
//     console.log(props.match, "これ")
//     console.log(props.match.params, "これ")

//     return (
//         <div>
//             <p>{id}番目の記事です</p>
//             <p><Link to="/blog/">Blog0へ(Link機能)</Link></p>
//         </div>
//     )
// }

// const Sum = props => {
//     const { num1, num2 } = props.match.params
//     return (
//         <div>
//             <p>{num1} + {num2} = {parseInt(num1) + parseInt(num2)}</p>
//             <p>{num1} + {num2} = {num1 + num2} 間違い文字列</p>
//             <p><Link to="/sum/">Sum0へ(Link機能)</Link></p>
//         </div>
//     )
// }

export default Router
