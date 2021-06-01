import React, { useState, useEffect } from "react";
import Img from "../images/test.png";
import { storage, db } from "../firebase";
import firebase from "firebase/app";
// Feed.jsからfirebaseのデータをPost.jsに流す（propsで渡すというイメージ）
// propsを受け取りましょう！（つまり、このデータがわたってくるよ！っていうものを書いてあげる）
const Post = ({ text, image, timestamp, postId }) => {
  // 登録の処理
  // どう言うイメージ？？個別postId（id）に紐づくfirebaseの保存スペースに
  // 「comment」というデータのお部屋を作ります＝これがしたの<p></p>タグで書いているコメント一覧になります🤗
  // コメントの入力欄のinputの文字列を保持したいのでuseStateを使いましょう
  const [comment, setComment] = useState("");
  // firebaseに登録されたデータを表示するためにデータを保持したいのでuseStateを使いましょう🤗
  const [comments, setComments] = useState([
    {
      id: "",
      text: "",
      timestamp: null,
    },
  ]);
  // useEffect
  // 記述2.useEffectを使って、Firebaseのデータを取得してuseStateで保持する
  useEffect(() => {

    if (!postId) return false;  //追記★
    // 全部にコメントが投稿されている？→されているものと、されていないものがあるならそれをハンドリングしないとだめだよね！っていうイメージです


    const firebaseData = db
      .collection("posts")
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
  
  // 送信を押されたら登録の処理を実行させる記述 ※ほぼTweetInputのロジックと同じです🤗
  const handleAddNewComment = (e) => {
    // formタグを使う時,送信のtype=submitを使うとページがリロードされるので、リロードの処理を無効にしましょう🤗
    e.preventDefault();
    // firebaseのdbにアクセスをしてデータを登録します
    // doc()これがポイント！
    db.collection("posts").doc(postId).collection("comment").add({
      text: comment, //useStateの[comment]です
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    // 送信のボタンが押されたら入力欄を空にしたいのでsetComment("")を使う
    setComment("");
  };


  return (
    <>
      <div className="card">
        {/* 記述2. 画像を表示　imgタグを使って、imgのURLをsrc={xxx}に渡してあげる */}
        {/* 画像があるとき */}
        {image && <img src={image} alt="" />}
        {/* 画像ない時 */}
        {!image && <img src={Img} alt="" />}
        {/*  */}
        
        <div variant="body2" color="textSecondary" component="p">
          {text}
        </div>
        
        <div gutterBottom variant="h5" component="h2">
          {new Date(timestamp?.toDate()).toLocaleString()}
        </div>
        {/* 機能追加したいときは先にhtmlで書いちゃう */}
        {/* それを完成させたらコンポーネントに分割する */}
        <div className="comment">
          {/* firebaseのデータを取得する */}
          {/* mapでデータを取得してレンダリングする箇所 */}
          {comments &&
            comments.map((comment) => (
              <p>
                {new Date(comment.timestamp?.toDate()).toLocaleString()}
                　
                {comment.text}
              </p>
            ))}
        </div>
        
        {/* formタグを設置して投稿ようの入力欄を作る */}
        <form onSubmit={handleAddNewComment}>
          <input
            type="text"
            placeholder="コメントを記述してください"
            value={comment}
            //入力した文字列を更新し,useStateで作成した[comment]に文字列が入ってきます🤗
            onChange={(e) => setComment(e.target.value)}
          />
          {/* 送信用のボタンをおく */}
          <button
            type="submit"
            disabled={!comment} //コメントが空の時は押せないようにする
          >
            コメントを投稿する
          </button>
        </form>
      </div>
    </>
  );
};
export default Post;