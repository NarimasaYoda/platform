import React, { useState, useEffect, Component } from 'react'
import { BrowserRouter, Route, Link } from "react-router-dom"

import Home from "./Home"
import Login from "./Login"

import Drink from "./Drink"
import Event from "./Event"
// import Chat from "./Chat"
import Conversation from "./Conversation"

import Admin from "./Admin"
import AdminDrink from "./AdminDrink"
import Test from "./Test"

const Router = () => (
    <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route path="/login" render={() => <Login JumpTo="/" />} />
        <Route path="/loginEvent" render={() => <Login JumpTo="event" />} />
        <Route path="/loginDrink" render={() => <Login JumpTo="drink" />} />
        <Route path="/loginConversation" render={() => <Login JumpTo="conversation" />} />

        <Route path="/admin" component={Admin} />
        <Route path="/adminDrink" component={AdminDrink} />

        <Route path="/drink" component={Drink} />
        <Route path="/event" component={Event} />
        {/* <Route path="/chat" component={Chat} /> */}
        <Route path="/conversation" component={Conversation} />
 
        <Route path="/test" component={Test} />
        {/* <Route path="/blog/:id" component={Blog} /> */}
        {/* <Route path="/sum/" component={Sum0} /> */}
        {/* <Route path="/sum/:num1/:num2" component={Sum} /> */}
    </BrowserRouter>
)

export default Router
