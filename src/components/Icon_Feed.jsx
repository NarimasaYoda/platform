import React, { useState, useEffect } from "react";
import { storage, db, auth } from "../firebase";

import Img from "../images/no_image.png";

const Icon_Feed = ({ id, DB, STORAGE, STORAGE2, uid }) => {
    const [posts, setPosts] = useState([{
        id: "",
        admin: "",
        email: "",
        image: "",
        image_name: "",
        nickname: "",
        uid: "",
        timestamp: null,
    }]);

    const getPostsData = (uidInfo) => {
        const firebase = db
            .collection(DB)
            .where('uid', '==', uidInfo)
            // .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) =>
                setPosts(
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
        getPostsData(uid);
    }, [])

    return (
        <div>
            <div className="imairu">
                {posts.map((postId, index) => (
                    <div className="items">
                        {postId.image && <img src={postId.image} alt="" className="post_image" />}
                        {!postId.image && <img src={Img} alt="" className="post_image" />}
                        <span className = "comment2">{postId.nickname}/{postId.uid}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Icon_Feed
