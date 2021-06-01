import React, { useState } from "react";
import firebase from "firebase/app";

import { storage, db } from "../firebase";

const TweetInput = () => {
    // 画像を保持するためのuseState、入力された文字を保持するためのuseState
    const [inputImage, setInputImage] = useState(null);
    const [message, setMessage] = useState("");

    // ファイル選択して、画像を選ぶ。画像を保持する
    const onChangeImageHandler = (e) => {
        if (e.target.files[0]) {
            setInputImage(e.target.files[0]);
            e.target.value = "";
        }
    };

    // 送信ボタンが押されたら（エンターが押されたら）送信の処理=firebaseにデータを登録する処理。
    const sendTweet = (e) => {

        // useStateで保持した変数を確認
        // console.log(message,"message");
        console.log(inputImage, "inputImage");

        e.preventDefault();
        if (inputImage) {
            // 画像 + テキストを登録させる。
            // firebaseの仕様で同じファイル名の画像を複数回アップしてしまうと元々あったファイルが削除される
            // そのためにファイル名をランダムなファイル名を作る必要がある、以下記述のとおり。
            const S =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補、62文字
            const N = 16; //16文字の文字列を作るという意味。生成したい文字数が１６の文字列になる
            const randomMoji = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が１６こ選ばれる
                .map((n) => S[n % S.length])
                .join("");
            const fileName = randomMoji + "_" + inputImage.name;
            // firebase storageに登録する処理
            const uploadTweetImg = storage.ref(`images/${fileName}`).put(inputImage);
            
            // firebaseのDBに登録する処理
            uploadTweetImg.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                // 3つ設定できる。進捗度合い = プログレス。エラーに関する = アップロードがうまくいかないなどのエラーを管理する。
                // 成功した時 async（非同期＝何かを実行した後に次のことをするためのもの）
                
                () => { }, //進捗度合いの管理するもの、
                (err) => {
                    //エラーに関する処理
                    alert(err.message);
                },
                async () => {
                    //成功したとき
                    await storage
                        .ref("images")
                        .child(fileName)
                        .getDownloadURL()
                        .then(async (url) => {
                            await db.collection("posts").add({
                                image: url,
                                text: message,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            });
                        });
                }
            );
        } else {
            db.collection("posts").add({
                image: "",
                text: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
        }
    };
    return (
        <div>
            <form onSubmit={sendTweet}>
                <div>
                    <input
                        type="text"
                        placeholder="文字を入力してください"
                        autoFocus
                        value={message}
                        // 入力された文字を取得するためにonChangeイベントを設定。直接setMessageで更新して書く方法の方が短縮化。
                        onChange={(e) => setMessage(e.target.value)}
                    // onChange={handleInputChange} ←同じような書き方
                    />
            
                </div>
                <div>
                    <input type="file" onChange={onChangeImageHandler} />
                </div>
                <div>
                    <button type="submit" disabled={!message}>
                        コメント＆画像の投稿
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TweetInput;