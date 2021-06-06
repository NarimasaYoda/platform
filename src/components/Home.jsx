import React from 'react'
import { Link } from "react-router-dom"
import TinderCard from 'react-tinder-card'

import "../styles/style.css";


const Home = () => {

    const onSwipe = (direction) => {
        console.log('You swiped: ' + direction)
    }

    const onCardLeftScreen = (myIdentifier) => {
        console.log(myIdentifier + ' left the screen')
    }


    return (
        <>
            <h1 className="title">マチのPlatform</h1>

            <hr />

            <div className="home">
                <div className="items">
                    <p><Link to="/drink">飲みに行く</Link></p>
                    <p><Link to="/register">登録</Link></p>
                    <p><Link to="/event">イベント情報</Link></p>
                </div>
                
                <div className="info">
                <TinderCard className="title" onSwipe={onSwipe} onCardLeftScreen={() => onCardLeftScreen('fooBar')} preventSwipe={['right', 'left']}>
                    <h1 className="title">SNS情報を抽出をめくる</h1>
                </TinderCard>
                    
                </div>
            </div>

            <hr />
            <p><Link to="/register">registerへ</Link></p>
            <p><Link to="/drink">drinkへ</Link></p>
            <hr />
            <p><Link to="/test">testへ</Link></p>
        </>
    )
}

export default Home
