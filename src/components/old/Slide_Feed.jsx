import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import Slide_Post from "./Test_Slide_Post";

// Feed（プロップスを渡す方）
const Slide_Feed = ({ DB, STORAGE }) => {

    //firebaseに作成（登録した）項目（データ）を受け取るために必要な箱＝useState
    const [posts, setPosts] = useState([{
        id:"",
        date: "",
        event: "",
        image: "",
        image_name: "",
        text: "",

        tag_name:"",// itemNames = ["GTJZ", "Toshiya", "タナ", "大当", "夢亀"];
        item_initial:"",// itemInitial = ["G", "T", "T", "O", "Y"];
        item_fullName:"",//itemOfficialNames = ["後藤醸造","寿矢","タナ","大当たり","夢亀ラーメン"];
        item_comment:"",//itemCategories = ["立ち飲み！", "寿司うまし", "魚が美味", "ソウルフード", "熊本ラーメン"];

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
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        date: doc.data().date,
                        event: doc.data().event,
                        image: doc.data().image,
                        image_name: doc.data().image_name,
                        text: doc.data().text,

                        tag_name: doc.data().tag_name,
                        item_initial: doc.data().item_initial,
                        item_fullName: doc.data().item_fullName,
                        item_comment: doc.data().item_comment,

                        timestamp: doc.data().timestamp
                    }))
                )
            )
    }, []); //最初に一度Firebaseにアクセスすることを意味する

    return (
        <div>
            {posts.map((postItem) => (
                <Slide_Post
                    key={postItem.id}

                    id={postItem.id}

                    date={postItem.date}
                    event={postItem.event}
                    image={postItem.image}
                    image_name={postItem.image_name}
                    text={postItem.text}

                    tag_name={postItem.tag_name}
                    item_initial={postItem.item_initial}
                    item_fullName={postItem.item_fullName}
                    item_comment={postItem.item_comment}

                    timestamp={postItem.timestamp}

                    DB={DB}
                    STORAGE={STORAGE}
                />
            ))}
        </div>
    )
}
export default Slide_Feed