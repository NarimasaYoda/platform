import React, { useState, useEffect } from "react";
import Img from "../images/test.png";
import { storage, db } from "../firebase";
import firebase from "firebase/app";

// Post（プロップスを受け取って表示する方）
const Event_Post = ({ id, date, event, image, text, timestamp, postId }) => {

  // 登録の処理
  // 個別postId（id）に紐づくfirebaseの保存スペースに「comment」というデータ
  const [comment, setComment] = useState("");
  // firebaseに登録されたデータを表示するためにデータを保持したいのでuseStateを使用
  const [comments, setComments] = useState([
    {
      id: "",
      date: "",
      event: "",
      text: "",
      timestamp: null,
    },
  ]);
  // useEffect
  // 記述2.useEffectを使って、Firebaseのデータを取得してuseStateで保持する
  useEffect(() => {

    if (!postId) return false;  //追記★
    // 全部にコメントが投稿されているかどうかでハンドリングしないといけない。というイメージです

    const firebaseData = db
      .collection("events")
      // ポイントです！
      .doc(postId)
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
  }, [postId]);

  // 送信を押されたら登録の処理を実行させる記述
  const handleAddNewComment = (e) => {
    // formタグを使う時、送信のtype=submitを使うとページがリロードされるので、リロードの処理を無効にする
    e.preventDefault();
    // firebaseのdbにアクセスをしてデータを登録。doc()これがポイント！
    db.collection("events").doc(postId).collection("comment").add({
      text: comment, //useStateの[comment]です
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    // 送信のボタンが押されたら入力欄を空にしたいのでsetComment("")を使う
    setComment("");
  };

  const deleteData = () => {
    db.collection("events").doc(id).delete();
    storage.ref(`images/${image}`).delete();
  }


  return (
    <>
      <div className="event">
        <div className="items">

          <div variant="body2" color="textSecondary" component="p" className="post_comment1">
            日時：{date}
          </div>
          <div variant="body2" color="textSecondary" component="p" className="post_comment1">
            イベント：{event}
          </div>
          <div className="post_comment3">
            投稿：{new Date(timestamp?.toDate()).toLocaleString()}
            <button onClick={deleteData}>削除</button>
          </div>
      
          {/* 画像があるとき */}
          {image && <img src={image} alt="" className="post_image" />}
          {/* 画像ない時 */}
          {!image && <img src={Img} alt="" className="post_image" />}

          <div variant="body2" color="textSecondary" component="p" className="post_comment1">
            メッセージ：{text}
          </div>

          <div>
            {/* firebaseのデータを取得、mapでデータを取得してレンダリングする */}
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

          {/* formタグを設置して投稿ようの入力欄を作る */}
          <form onSubmit={handleAddNewComment}>
            <input
              type="text"
              placeholder="コメントを記述"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={!comment}
            >
              コメントを投稿する
          </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Event_Post;