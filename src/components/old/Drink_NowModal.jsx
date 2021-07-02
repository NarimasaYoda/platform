import React, { useState, useEffect } from "react";
// import firebase from "firebase/app";
import { storage, db, auth } from "../../firebase";
// import { useHistory } from 'react-router-dom';

import Img from "../images/test.png";

// Post（プロップスを受け取って表示する方）
const Drink_Now = ({ key, id, DB, STORAGE }) => {

    const [imairuInfo, setImairuInfo] = useState([{
        id: "",
        id_name: "",
        image: "",
        image_name: "",
        uid: "",
        text: "",
        timestamp: null,
    },]);

    useEffect(() => {
        if (!id) return false;  //追記 全部にコメントが投稿されているかどうかでハンドリングしないといけない。

        const firebaseData = db
            .collection(DB)
            // ポイントです！
            .doc(id)
            .collection("imairu")
            .orderBy("timestamp", "asc")
            .onSnapshot((snapshot) =>
                setImairuInfo(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,

                        id_name: doc.data().id_name,
                        image: doc.data().image,
                        image_name: doc.data().image_name,
                        uid: doc.data().uid,
                        text: doc.data().text,
                        timestamp: doc.data().timestamp,
                    }))
                )
            );
        return () => {
            firebaseData();
        };
    }, [id]);

    return (
        <div className="imairu">
            {imairuInfo && imairuInfo.map((info) => (
                <div className="items">
                    {/* 画像があるとき */}
                    {info.image && <img src={info.image} alt="" className="post_image" />}
                    {/* 画像ない時 */}
                    {!info.image && <img src={Img} alt="" className="post_image" />}
                </div>
            ))}
        </div>
    );
};

export default Drink_Now;