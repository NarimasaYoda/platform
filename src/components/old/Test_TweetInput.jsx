import React, { useState } from "react";
import firebase from "firebase/app";
import { storage, db } from "../firebase";

const Test_TweetInput = ({ DB, STORAGE }) => {
    // 画像を保持するためのuseState、入力された文字を保持するためのuseState
    const [inputImage, setInputImage] = useState(null);
    const [drinkMessage, setDrinkMessage] = useState("");

    // ファイル選択して、画像を選ぶ。画像を保持する
    const onChangeImageHandler = (e) => {
        if (e.target.files[0]) {
            setInputImage(e.target.files[0]);
            e.target.value = "";
        }
    };

    const sendTweet = (e) => {
        e.preventDefault();
        if (inputImage) {
            // 画像 + テキストを登録させる。firebaseの仕様で同じファイル名の画像を複数回アップしてしまうと元々あったファイルが削除される。
            // そのためにファイル名をランダムなファイル名を作る必要がある、以下記述のとおり。
            const S =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補、62文字
            const N = 16; //16文字の文字列を作るという意味。生成したい文字数が１６の文字列になる
            const randomMoji = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が１６こ選ばれる
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

                () => { }, //進捗度合いの管理するもの、
                (err) => {
                    //エラーに関する処理
                    alert(err.message);
                },
                async () => {
                    //成功したとき
                    await storage
                        .ref(STORAGE)
                        .child(fileName)
                        .getDownloadURL()
                        .then(async (url) => {
                            await db.collection(DB).add({
                                image: url,
                                image_name: fileName,
                                text: drinkMessage,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            });
                        });
                }
            );
        } else {
            db.collection(DB).add({
                image: "",
                image_name: "",
                text: drinkMessage,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
        }
        setDrinkMessage("");
    };

    return (
        <div className="test">
            <form className="items" onSubmit={sendTweet}>
                <div className="items2">
                    <input
                        type="text"
                        placeholder="新規コメント入力"
                        autoFocus
                        value={drinkMessage}
                        onChange={(e) => setDrinkMessage(e.target.value)}
                    />
                </div>
                <div className="items2">
                    <input type="file" name="file" onChange={onChangeImageHandler} />
                </div>
                <div>
                    <button type="submit" disabled={!drinkMessage}>
                        「コメント」or「コメント＆画像」の投稿
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Test_TweetInput;