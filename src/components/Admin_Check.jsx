import React, { useState, useEffect } from "react";
import { storage, db, auth } from "../firebase";
import { Link, useHistory } from "react-router-dom"

const Admin_Check = ({ id, DB, STORAGE, STORAGE2, uid }) => {
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

    const history = useHistory()

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

    if (posts[0].admin === 0) {
        history.push("/login");
    }

    return (
        <></>
    )
}

export default Admin_Check
