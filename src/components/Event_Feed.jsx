import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import Event_Post from "./Event_Post";

const Event_Feed = () => {

    //firebaseに作成（登録した）項目（データ）を受け取るために必要な箱＝useState
    //useStateを記述してfirebaseに登録されているデータの項目と同じ構造にする（オブジェクト＝データの塊）
    //データを受け取れるように{}で準備する
    const [posts, setPosts] = useState([{
        // id: "",
        // image: "",
        // text: "",
        // timestamp: null,

        date:"",
        event: "",
        image: "",
        text: "",
        timestamp: null,
    }]);

    //useEffectを使って、firebaseのデータを取得してuseStateで保持する
    useEffect(() => {
        //Firebaseのデータもと、取得方法
        //Firebaseに変更があったら感知する(Firebaseの機能)
        //doc＝ドキュメント

        const firebaseData = db
            .collection('events')
            .orderBy('timestamp', 'desc')

            .onSnapshot((snapshot) =>
                setPosts(
                    //data()はfirebaseで指定されたコード記載方法
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        date:doc.data().date,
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
                    postId={postItem.id}
                    key={postItem.id}

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