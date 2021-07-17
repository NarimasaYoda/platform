import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { useHistory } from 'react-router-dom';
import ReactImageBase64 from "react-image-base64"

import { toBlobFunction } from "./Function/Functions"

const Event_TweetInput = ({ DB, STORAGE }) => {

    // 画像を保持するためのuseState、入力された文字を保持するためのuseState
    const [images, setImages] = useState({ data: [] });
    const [eventDate, setEventDate] = useState("");
    const [eventTitle, setEventTitle] = useState("");
    const [eventMessage, setEventMessage] = useState("");

    const history = useHistory()
    const loginUser = (e) => {
        auth.onAuthStateChanged(user => {
            // ログイン状態の場合、currentUserというステート（変数）にAPIから取得したuser情報を格納
            // ログアウト状態の場合、ログインページ（loginEvent）へリダイレクト
            !user && history.push("loginEvent");
        });
    }
    // 送信ボタンが押されたら（エンターが押されたら）送信の処理=firebaseにデータを登録する処理。
    const sendTweet = async (e) => {
        // console.log(e)
        loginUser();
        // e.preventDefault();// formタグを使う時、送信のtype=submitを使うとページがリロードされるので、リロードの処理を無効にする
        if (images.data.length > 0) {
            // 画像 + テキストを登録させる。firebaseの仕様で同じファイル名の画像を複数回アップしてしまうと元々あったファイルが削除される。
            // そのためにファイル名をランダムなファイル名を作る必要がある、以下記述のとおり。
            const image = images.data[0].fileData
            const S =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補、62文字
            const N = 16; //16文字の文字列を作るという意味。生成したい文字数が16の文字列になる
            const randomMoji = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が16個選ばれる
                .map((n) => S[n % S.length])
                .join("");
            const fileName = randomMoji + "_" + image.name;

            // Blob形式のFileに変換後に、firebase storageに登録する処理
            let blobData = toBlobFunction(image)
            const uploadTweetImg = storage.ref(`${STORAGE}/${fileName}`).put(blobData);

            // firebaseのDBに登録する処理
            uploadTweetImg.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                // 3つ設定できる。進捗度合い = プログレス。エラーに関する = アップロードがうまくいかないなどのエラーを管理する。
                // 成功した時 async（非同期＝何かを実行した後に次のことをするためのもの）
                () => { }, //進捗度合いを管理するもの、
                (err) => {
                    //エラーに関する処理
                    alert(err.eventMessage);
                },
                async () => {
                    //成功したとき
                    await storage
                        .ref(STORAGE)
                        .child(fileName)
                        .getDownloadURL()
                        .then(async (url) => {
                            await db.collection(DB).add({
                                date: eventDate,
                                event: eventTitle,
                                image: url,
                                image_name: fileName,
                                text: eventMessage,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            });

                            setEventDate("");
                            setEventTitle("");
                            setEventMessage("");
                            setImages({ data: [] });
                            document.querySelector('#js-image-base64').value = '';
                        });
                }
            );
        } else {
            db.collection(DB).add({
                date: eventDate,
                event: eventTitle,
                image: "",
                image_name: "",
                text: eventMessage,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });

            setEventDate("");
            setEventTitle("");
            setEventMessage("");
            setImages({ data: [] });
        }
    };

    return (
        <div className="event_tweet center">
            <div>
                <input
                    type="date"
                    autoFocus
                    value={eventDate}
                    size="20"
                    onChange={(e) => setEventDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="イベント名 入力（必須）"
                    autoFocus
                    value={eventTitle}
                    size="30"
                    onChange={(e) => setEventTitle(e.target.value)}
                />
                <div>
                    <textarea
                        type="text"
                        placeholder="コメント 入力（必須）"
                        autoFocus
                        value={eventMessage}
                        cols="30"
                        rows="4"
                        onChange={(e) => setEventMessage(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <ReactImageBase64
                    maxFileSize={10485760}
                    thumbnail_size={200}
                    // drop={true}
                    // dropText="ファイルをドラッグ＆ドロップもしくは"
                    // capture="environment"
                    // multiple={true}
                    handleChange={data => {
                        if (data.result) {
                            console.log(images, "imagesのこと")
                            let list = images.data
                            list.push(data);
                            console.log(list, "listのこと")
                            setImages({ data: list })
                        } else {
                            // setErrors([...errors, data.messages]);
                        }
                    }}
                />
            </div>
            <div>
                {images.data.map((image, index) => (
                    <img src={image.fileData} alt={"sugoi"} width={70} className="tweet_image" />
                ))}
            </div>
            <div>
                <button type="button" disabled={!eventDate || !eventTitle || !eventMessage} onClick={sendTweet}>
                    「イベント」or「イベント＆画像」の投稿
                </button>
            </div>
        </div>
    );
};
export default Event_TweetInput;