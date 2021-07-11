import React, { useState, useEffect } from "react";
import Img from "../images/no_image.png";
import { storage, db } from "../firebase";
import firebase from "firebase/app";

// Post（プロップスを受け取って表示する方）
const Test_Post = ({ key, id, date, event, image, image_name, text, timestamp, DB, STORAGE }) => {

  // 登録の処理
  // 個別idに紐づくfirebaseの保存スペースに「comment」というデータ
  const [comment, setComment] = useState("");
  // firebaseに登録されたデータを表示するためにデータを保持したいのでuseStateを使用
  const [comments, setComments] = useState([
    {
      id: "",
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
    // formタグを使う時、送信のtype=submitを使うとページがリロードされるので、リロードの処理を無効にする
    e.preventDefault();
    // firebaseのdbにアクセスをしてデータを登録。doc()これがポイント！
    db.collection(DB).doc(id).collection("comment").add({
      text: comment, //useStateの[comment]です
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    // 送信のボタンが押されたら入力欄を空にしたいのでsetComment("")を使う
    setComment("");
  };

  const deleteData = () => {
    db.collection(DB).doc(id).delete();
    storage.ref(`${STORAGE}/${image_name}`).delete();
  }

  return (
    <>
      <div className="drink">
        <div className="items">
          <p className="post_comment1">{text}</p>
          <p className="post_comment3">
            投稿：{new Date(timestamp?.toDate()).toLocaleString()}
            <button onClick={deleteData}>削除</button>
          </p>
          {/* 画像があるとき */}
          {image && <img src={image} alt="" className="post_image" />}
          {/* 画像ない時 */}
          {!image && <img src={Img} alt="" className="post_image" />}

          <div>
            {comments &&
              comments.map((comment) => (
                <p>
                  <span className="post_comment3">
                    {new Date(comment.timestamp?.toDate()).toLocaleString()}<span> : </span>
                  </span>
                  <span className="post_comment2">
                    {comment.text}
                  </span>
                </p>
              ))}
          </div>


          {/* formタグでコメント入力欄 */}
          <form onSubmit={handleAddNewComment}>
            <input
              type="text"
              placeholder="コメント入力"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={!comment} //コメントが空の時は押せないようにする
            >
              コメントを投稿する
          </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Test_Post;