import React, { useState, useEffect } from "react";
import Img from "../images/test.png";
import { storage, db } from "../firebase";
import firebase from "firebase/app";
// Feed.jsからfirebaseのデータをPost.jsに流す（propsで渡すというイメージ）
// propsを受け取りましょう！（つまり、このデータがわたってくるよ！っていうものを書いてあげる）
const Event_Post = ({ date,event,image,text, timestamp, postId }) => {

  // 登録の処理
  // どう言うイメージ？？個別postId（id）に紐づくfirebaseの保存スペースに
  // 「comment」というデータのお部屋を作ります＝これがしたの<p></p>タグで書いているコメント一覧になります🤗
  // コメントの入力欄のinputの文字列を保持したいのでuseStateを使いましょう
  const [comment, setComment] = useState("");
  // firebaseに登録されたデータを表示するためにデータを保持したいのでuseStateを使いましょう🤗
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


  return (
    <>
      <div className="event">
        <div className="items">

          <div variant="body2" color="textSecondary" component="p" className="post_comment1">
            {date}
          </div>
          <div variant="body2" color="textSecondary" component="p" className="post_comment1">
            {event}
          </div>
          
          {/* 記述2. 画像を表示 imgタグを使って、imgのURLをsrc={xxx}に渡してあげる */}
          {/* 画像があるとき */}
          {image && <img src={image} alt="" className="post_image" />}
          {/* 画像ない時 */}
          {!image && <img src={Img} alt="" className="post_image" />}
          {/*  */}

          <div variant="body2" color="textSecondary" component="p" className="post_comment1">
            {text}
          </div>

          <div gutterBottom variant="h5" component="h2" className="post_comment1">
            {new Date(timestamp?.toDate()).toLocaleString()}
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

export default Event_Post;