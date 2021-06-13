import React, { useState, useEffect } from 'react'
import { db } from "../firebase";
import TinderCard from 'react-tinder-card'

const Home_card = () => {

    const [posts, setPosts] = useState([{
        image: "",
        text: "",
        timestamp: null,
    }]);

    useEffect(() => {
        const firebaseData = db
            .collection('homes')
            // .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) =>
                setPosts(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        image: doc.data().image,
                        text: doc.data().text,
                        timestamp: doc.data().timestamp
                    }))
                )
            )
    }, []); //最初に一度Firebaseにアクセスすることを意味する

    const [lastDirection, setLastDirection] = useState()

    const swiped = (direction) => {
        setLastDirection(direction)
    }

    return (
        <div>
            <div className='cardContainer'>
                {posts.map((postID, index) =>
                    <TinderCard
                        className='swipe'
                        key={index}
                        onSwipe={(dir) => swiped(dir)}>
                        <div
                            style={{ backgroundImage: 'url(' + postID.image + ')' }}
                            className='card'>
                            <h3>{postID.text}</h3>
                        </div>
                    </TinderCard>
                )}
            </div>
            {lastDirection ?
                <h2 className='infoText'>You swiped {lastDirection}</h2>
                : <h2 className='infoText'>You swipe?</h2>}
        </div>
    )
}

export default Home_card
