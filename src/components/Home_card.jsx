import React, { useState, useEffect } from 'react'
import { db } from "../firebase";
import TinderCard from 'react-tinder-card'
import { shuffle } from './Function/Functions';

const Home_card = ({DB}) => {

    const [posts, setPosts] = useState([{
        image: "",
        text: "",
        timestamp: null,
    }]);

    const [shufflePosts, setShufflePosts] = useState([{
        image: "",
        text: "",
        timestamp: null,
    }]);

    const getCardData =()=>{
        const firebaseData = db
            .collection(DB)
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
    }

    useEffect(() => {
        getCardData()
    }, []); //最初に一度Firebaseにアクセスすることを意味する

    useEffect(()=>{
        setShufflePosts(shuffle(posts))
    }, [posts])

    const [lastDirection, setLastDirection] = useState()

    const swiped = (direction) => {
        setLastDirection(direction)
    }

    return (
        <div>
            <div className='cardContainer'>
                {shufflePosts.map((postID, index) =>
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
                <h2 className='infoText'>You swiped "{lastDirection}"</h2>
                : <h2 className='infoText'>You swipe?</h2>}
        </div>
    )
}

export default Home_card
