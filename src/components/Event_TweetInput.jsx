import React, { useState } from "react";
import firebase from "firebase/app";
import { storage, db } from "../firebase";

const Event_TweetInput = ({ DB, STORAGE }) => {
    // 画像を保持するためのuseState、入力された文字を保持するためのuseState
    const [inputImage, setInputImage] = useState(null);
    const [eventDate, setEventDate] = useState("");
    const [eventTitle, setEventTitle] = useState("");
    const [eventMessage, setEventMessage] = useState("");

    // ファイル選択して、画像を選ぶ。画像を保持する
    const onChangeImageHandler = (e) => {
        if (e.target.files[0]) {
            setInputImage(e.target.files[0]);
            e.target.value = "";
        }
    };

    // 送信ボタンが押されたら（エンターが押されたら）送信の処理=firebaseにデータを登録する処理。
    const sendTweet = (e) => {
        e.preventDefault();
        if (inputImage) {
            // 画像 + テキストを登録させる。
            // firebaseの仕様で同じファイル名の画像を複数回アップしてしまうと元々あったファイルが削除される
            // そのためにファイル名をランダムなファイル名を作る必要がある、以下記述のとおり。
            const S =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補、62文字
            const N = 16; //16文字の文字列を作るという意味。生成したい文字数が16の文字列になる
            const randomMoji = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が16個選ばれる
                .map((n) => S[n % S.length])
                .join("");
            const fileName = randomMoji + "_" + inputImage.name;
            // firebase storageに登録する処理
            const uploadTweetImg = storage.ref(`${STORAGE}/${fileName}`).put(inputImage);

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
        }

        setEventDate("");
        setEventTitle("");
        setEventMessage("");
    };

    return (
        <div className="event">
            <form className="items" onSubmit={sendTweet}>
                <div>
                    <input
                        type="date"
                        autoFocus
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="イベント名 入力"
                        autoFocus
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="コメント 入力"
                        autoFocus
                        value={eventMessage}
                        onChange={(e) => setEventMessage(e.target.value)}
                    />

                </div>
                <div className="items2">
                    <input type="file" name="file" onChange={onChangeImageHandler} />
                </div>
                <div>
                    <button type="submit" disabled={!eventDate || !eventTitle || !eventMessage}>
                        「イベント」or「イベント＆画像」の投稿
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Event_TweetInput;