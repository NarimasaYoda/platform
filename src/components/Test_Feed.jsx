import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import Test_Post from "./Test_Post";

const Test_Feed = () => {

    //firebaseに作成（登録した）項目（データ）を受け取るために必要な箱＝useState
    //useStateを記述してfirebaseに登録されているデータの項目と同じ構造にする（オブジェクト＝データの塊）
    //データを受け取れるように{}で準備する
    const [fbData, setFbData] = useState([{
        text: "",
    }]);

    useEffect(() => {
        const firebaseData = db
            .collection('tests')
            .onSnapshot((snapshot) =>
                setFbData(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        text: doc.data().text,
                    }))
                )
            )
    }, []); //最初に一度Firebaseにアクセスすることを意味する

    return (
        <div>
            {fbData.map((data_a) => (

                // {posts[0]?.id &&
                //     posts.map((postItem) => (
                //es6のmapを使うときは「mapを使って処理をしている箇所で」[key]の指定が必要です
                //keyがあるとバーチャルドムのkeyが指定できる？
                <Test_Post
                    key={data_a.id}
                    text={data_a.text}
                />
            ))}
        </div>
    )
}
export default Test_Feed