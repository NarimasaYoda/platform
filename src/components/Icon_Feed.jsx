import React, { useState, useEffect } from "react";
import { storage, db, auth } from "../firebase";

import Img from "../images/test.png";

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

    const uid2 = "zGQvjvAumwOjtB1nDSs8nfLkQqp1"

    // const getUser = () => {
    //     return new Promise(resolve => {
    //         auth.onAuthStateChanged(user => {
    //             if (user === null) {
    //                 return ""
    //             } else {
    //                 return user;
    //             }
    //         });
    //     })
    // }

    // const user = ""
    // const func = async () => {
    //     user = await getUser();
    // }

    // func();
    // // const user = getUser();
    // console.log(user.uid, "※user.uid")

    const getPostsData = (uid_data) => {
        // return new Promise(resolve => {
        const firebase = db
            .collection(DB)
            .where('uid', '==', uid_data)
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
        // })
    }

    useEffect(() => {
        getPostsData(uid2);
    }, []); //最初に一度Firebaseにアクセスすることを意味する

    console.log(posts, "posts")

    return (
        <div>
            <div className="imairu">
                {/* //{posts.map((postItem, index) => ( */}

                {posts.map((aaa, index) => (
                    <div className="items">
                        <img src={aaa.image} alt="" className="post_image" />
                        {aaa.uid}
                    </div>
                ))}

            </div>

        </div>
    )
}

export default Icon_Feed
