import React, { useState } from "react";
import firebase from "firebase/app";
import { storage, db } from "../firebase";

const Admin_InputImages = ({ DB, STORAGE }) => {
    const [inputImage, setInputImage] = useState(null);
    const [comments, setComments] = useState("");

    const onChangeImageHandler = (e) => {
        if (e.target.files[0]) {
            setInputImage(e.target.files[0]);
            e.target.value = "";
        }
    };

    const sendTweet = (e) => {
        e.preventDefault();
        if (inputImage) {
            const S =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補、62文字
            const N = 16; //16文字の文字列を作るという意味。生成したい文字数が16の文字列になる
            const randomMoji = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が16個選ばれる
                .map((n) => S[n % S.length])
                .join("");
            const fileName = randomMoji + "_" + inputImage.name;

            const uploadTweetImg = storage.ref(`${STORAGE}/${fileName}`).put(inputImage);

            uploadTweetImg.on(
                firebase.storage.TaskEvent.STATE_CHANGED,

                () => { }, //進捗度合いを管理するもの、
                (err) => {
                    alert(err.comments);
                },
                async () => {
                    await storage
                        .ref(STORAGE)
                        .child(fileName)
                        .getDownloadURL()
                        .then(async (url) => {
                            await db.collection(DB).add({
                                image: url,
                                image_name: fileName,
                                text: comments,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            });
                        });
                }
            );
        } else {
            db.collection(DB).add({
                image: "",
                image_name: "",
                text: comments,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
        }

        setComments("");
    };

    return (
        <div className="event">
            <form className="items" onSubmit={sendTweet}>
                <div>
                    <input
                        type="text"
                        placeholder="コメント 入力"
                        autoFocus
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </div>
                <div className="items2">
                    <input type="file" name="file" onChange={onChangeImageHandler} />
                </div>
                <div>
                    <button type="submit" disabled={!comments}>
                        「コメント＆画像」の投稿
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Admin_InputImages;