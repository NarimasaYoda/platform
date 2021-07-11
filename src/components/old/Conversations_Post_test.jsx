import React, { useState, useEffect } from 'react'
import firebase from "firebase/app";
import { storage, db, auth } from "../../firebase";
import { useHistory } from 'react-router-dom';

// import Img from "../images/no_image.png";

const Conversation_Post = (id, room_name, uid1, user1, user1_image, uid2, user2, user2_image, timestamp, DB, STORAGE) => {
    const [comment, setComment] = useState("");

    const [comments, setComments] = useState([
        {
            id: "",
            uid: "",
            user: "",
            user_image: "",
            text: "",
            timestamp: null,
        },
    ]);

    // useEffectを使って、Firebaseのデータを取得してuseStateで保持する
    useEffect(() => {

        if (!id) return false;  //追記★
        // 全部にコメントが投稿されているかどうかでハンドリングしないといけない。というイメージです

        const firebaseData = db
            .collection(DB)
            // ポイントです！
            .doc(id)
            .collection("conversation")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>
                setComments(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        uid: doc.data().uid,
                        user: doc.data().user,
                        user_image: doc.data().user_image,
                        text: doc.data().text,
                        timestamp: doc.data().timestamp,
                    }))
                )
            );
        return () => {
            firebaseData();
        };
    }, [id]);

      // 送信を押されたら登録の処理を実行させる記述
  const handleAddNewComment = (e) => {
    // loginUser();
    // e.preventDefault();// formタグを使う時、送信のtype=submitを使うとページがリロードされるので、リロードの処理を無効にする
    // firebaseのdbにアクセスをしてデータを登録。doc()これがポイント！
    db.collection(DB).doc(id).collection("conversation").add({
      text: comment, //useStateの[comment]です
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    // 送信のボタンが押されたら入力欄を空にしたいのでsetComment("")を使う
    setComment("");
  };

    return (
        <>
        <div>
            <div className="items">
                <p className="comment1">ユーザ：{user1}</p>
                <p className="comment1">ユーザ：{user2}</p>
                <p className="comment3">
                    投稿：{new Date(timestamp?.toDate()).toLocaleString()}
                    {/* <button onClick={deleteData}>削除</button> */}
                </p>


                <div>
                    {/* firebaseのデータを取得、mapでデータを取得してレンダリングする */}
                    {comments &&
                        comments.map((comment) => (
                            <p>
                                <span className="comment3">
                                    {new Date(comment.timestamp?.toDate()).toLocaleString()}<span> : </span>
                                </span>
                                <span className="comment2">
                                    {comment.text}
                                </span>
                            </p>
                        ))}
                </div>

                {/* 投稿用の入力欄を作る */}
                <input
                    type="text"
                    placeholder="コメントを記述"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    type="button"
                    disabled={!comment}
                    onClick={handleAddNewComment}>
                    コメントを投稿する
                </button>
            </div>
        </div>
        </>
    );
};


export default Conversation_Post

