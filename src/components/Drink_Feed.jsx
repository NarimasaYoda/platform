import React, { useState, useEffect } from "react";
import { storage, db } from "../firebase";

import Drink_Post from "./Drink_Post";

// Feed（プロップスを渡す方）
const Drink_Feed = ({ DB, STORAGE }) => {

    //firebaseに作成（登録した）項目（データ）を受け取るために必要な箱＝useState
    const [posts, setPosts] = useState([{
        id: "",
        date: "",
        event: "",
        image: "",
        image_name: "",
        text: "",
        timestamp: null,
    }]);

    //useEffectを使って、firebaseのデータを取得してuseStateで保持する
    useEffect(() => {
        //Firebaseのデータもと、取得方法。Firebaseに変更があったら感知する(Firebaseの機能)
        const firebaseData = db
            .collection(DB)
            .orderBy('timestamp', 'desc')

            .onSnapshot((snapshot) =>
                setPosts(
                    //data()はfirebaseで指定されたコード記載方法
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        date: doc.data().date,
                        event: doc.data().event,
                        image: doc.data().image,
                        image_name: doc.data().image_name,
                        text: doc.data().text,
                        timestamp: doc.data().timestamp
                    }))
                )
            )
    }, []); //最初に一度Firebaseにアクセスすることを意味する

    return (
        <>
            {posts.map((postItem) => (
                <Drink_Post
                    key={postItem.id}

                    id={postItem.id}

                    date={postItem.date}
                    event={postItem.event}
                    image={postItem.image}
                    image_name={postItem.image_name}
                    text={postItem.text}
                    timestamp={postItem.timestamp}

                    DB={DB}
                    STORAGE={STORAGE}
                />
            ))}
        </>
    )
}
export default Drink_Feed