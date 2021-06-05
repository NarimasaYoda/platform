import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import Event_Post from "./Event_Post";

// Feed（プロップスを渡す方）
const Event_Feed = () => {

    //firebaseに作成（登録した）項目（データ）を受け取るために必要な箱＝useState
    const [posts, setPosts] = useState([{
        date: "",
        event: "",
        image: "",
        text: "",
        timestamp: null,
    }]);

    //useEffectを使って、firebaseのデータを取得してuseStateで保持する
    useEffect(() => {
        //Firebaseのデータもと、取得方法。Firebaseに変更があったら感知する(Firebaseの機能)
        const firebaseData = db
            .collection('events')
            .orderBy('timestamp', 'desc')

            .onSnapshot((snapshot) =>
                setPosts(
                    //data()はfirebaseで指定されたコード記載方法
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        date: doc.data().date,
                        event: doc.data().event,
                        image: doc.data().image,
                        text: doc.data().text,
                        timestamp: doc.data().timestamp
                    }))
                )
            )
    }, []); //最初に一度Firebaseにアクセスすることを意味する

    return (
        <div>
            {posts.map((postItem) => (

                // {posts[0]?.id &&
                //     posts.map((postItem) => (
                //es6のmapを使うときは「mapを使って処理をしている箇所で」[key]の指定が必要です
                //keyがあるとバーチャルドムのkeyが指定できる？
                <Event_Post
                    key={postItem.id}

                    postId={postItem.id}
                    id={postItem.id}

                    date={postItem.date}
                    event={postItem.event}
                    image={postItem.image}
                    text={postItem.text}
                    timestamp={postItem.timestamp}
                />
            ))}
        </div>
    )
}
export default Event_Feed