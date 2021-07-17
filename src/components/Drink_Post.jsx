import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { useHistory } from 'react-router-dom';

import Img from "../images/no_image.png";

// Post（プロップスを受け取って表示する方）
const Drink_Post = ({ key, id, date, event, image, image_name, text, timestamp, DB, STORAGE }) => {

  // firebaseの保存スペースに「comment」というデータをセット
  const [comment, setComment] = useState("");
  // firebaseに登録されたデータを表示するためにデータを保持したいのでuseStateを使用
  const [comments, setComments] = useState([{
    id: "",
    text: "",
    timestamp: null,
  },]);

  const history = useHistory()
  const loginUser = (e) => {
    auth.onAuthStateChanged(user => {
      !user && history.push("loginDrink");
    });
  }

  // useEffectを使って、Firebaseのデータを取得してuseStateで保持する
  useEffect(() => {

    if (!id) return false;  //追記★
    // 全部にコメントが投稿されているかどうかでハンドリングしないといけない。というイメージです

    const firebaseData = db
      .collection(DB)
      // ポイントです！
      .doc(id)
      .collection("comment")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
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
    loginUser();
    // e.preventDefault();// formタグを使う時、送信のtype=submitを使うとページがリロードされるので、リロードの処理を無効にする
    // firebaseのdbにアクセスをしてデータを登録。doc()これがポイント！
    db.collection(DB).doc(id).collection("comment").add({
      text: comment, //useStateの[comment]です
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    // 送信のボタンが押されたら入力欄を空にしたいのでsetComment("")を使う
    setComment("");
  };

  const deleteData = () => {
    loginUser();
    db.collection(DB).doc(id).delete();
    storage.ref(`${STORAGE}/${image_name}`).delete();
  }

  return (
    <>
      <div className="drink_tweet">
        {/* <div className="items"> */}
          <p className="comment1">{text}</p>
          <p className="comment3">
            投稿：{new Date(timestamp?.toDate()).toLocaleString()}
            <button onClick={deleteData}>投稿削除</button>
          </p>
          {/* 画像があるとき */}
          {image && <img src={image} alt="" className="post_image" />}
          {/* 画像ない時 */}
          {!image && <img src={Img} alt="" className="post_image" />}

          <div>
            {comments &&
              comments.map((comment) => (
                <p className="comment2">
                  <span className="comment3">
                    {new Date(comment.timestamp?.toDate()).toLocaleString()}<span> : </span>
                  </span>
                    {comment.text}
                </p>
              ))}
          </div>


          {/* formタグでコメント入力欄 */}
          <input
            type="text"
            placeholder="コメント入力"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="button"
            disabled={!comment}
            onClick={handleAddNewComment}>
            コメントを投稿する
          </button>
        {/* </div> */}
      </div>
    </>
  );
};

export default Drink_Post;