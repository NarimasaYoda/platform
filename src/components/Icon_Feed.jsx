import React, { useState, useEffect } from "react";
import { storage, db, auth } from "../firebase";

import Img from "../images/no_image.png";

const Icon_Feed = ({ id, DB, uid, honorific, greet }) => {
    const [userData, setUserData] = useState([{
        id: "",
        admin: "",
        email: "",
        image: "",
        image_name: "",
        nickname: "",
        uid: "",
        timestamp: null,
    }]);

    const getUserData = (uidInfo) => {
        const firebase = db
            .collection(DB)
            .where('uid', '==', uidInfo)
            // .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) =>
                setUserData(
                    //data()はfirebaseで指定されたコード記載方法
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        admin: doc.data().admin,
                        email: doc.data().email,
                        image: doc.data().image,
                        image_name: doc.data().image_name,
                        nickname: doc.data().nickname,
                        uid: doc.data().uid,
                        timestamp: doc.data().timestamp
                    }))
                )
            )
    }

    useEffect(() => {
        getUserData(uid);
    }, [])

    return (
        <div>
            {userData.map((postId, index) => (
                <>
                    {postId.image && <img src={postId.image} alt="" className="icon_image" />}
                    {!postId.image && <img src={Img} alt="" className="icon_image" />}
                    <span className="comment2">『{postId.nickname}』{honorific}{greet}</span>
                </>
            ))}
        </div>
    )
}

export default Icon_Feed
