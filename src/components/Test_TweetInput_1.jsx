import React, { useState } from "react";
import firebase from "firebase/app";
import { storage, db } from "../firebase";

const Test_TweetInput_1 = ({ DB, STORAGE }) => {

    new Vue({
        el: '#app',
        data: {
            maxWidth: 300,
            smallImages: [],
            isResizing: false
        },
        methods: {
            onSubmit() {

                let formData = new FormData;

                this.smallImages.forEach((smallImage) => {

                    formData.append('images[]', smallImage);

                });

                axios.post('/resize_ajax', formData)
                    .then((response) => {

                        // Ajax通信が成功した時

                    });

            },
            onImageChange(e) {

                this.isResizing = true;
                this.smallImages = [];
                const files = e.target.files;

                for(let file of files) {

                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {

                        let img = new Image();
                        img.onload = () => {

                            let width = img.width;
                            let height = img.height;

                            if(width > this.maxWidth) {

                                height = Math.round(height * this.maxWidth / width);
                                width = this.maxWidth;

                            }

                            let canvas = document.createElement('canvas');
                            canvas.width = width;
                            canvas.height = height;
                            let ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);
                            ctx.canvas.toBlob((blob) => {

                                const imageFile = new File([blob], file.name, {
                                    type: file.type,
                                    lastModified: Date.now()
                                });
                                this.smallImages.push(imageFile);

                                if(this.smallImages.length == files.length) {

                                    this.isResizing = false;    // リサイズ完了！

                                }

                            }, file.type, 1);

                        };
                        img.src = e.target.result;

                    };

                }

            }
        }
    })



    // // 画像を保持するためのuseState、入力された文字を保持するためのuseState
    // const [inputImage, setInputImage] = useState(null);
    // const [drinkMessage, setDrinkMessage] = useState("");

    // // ファイル選択して、画像を選ぶ。画像を保持する
    // const onChangeImageHandler = (e) => {
    //     if (e.target.files[0]) {
    //         setInputImage(e.target.files[0]);
    //         e.target.value = "";
    //     }
    // };

    // const sendTweet = (e) => {
    //     e.preventDefault();
    //     if (inputImage) {
    //         // 画像 + テキストを登録させる。firebaseの仕様で同じファイル名の画像を複数回アップしてしまうと元々あったファイルが削除される。
    //         // そのためにファイル名をランダムなファイル名を作る必要がある、以下記述のとおり。
    //         const S =
    //             "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補、62文字
    //         const N = 16; //16文字の文字列を作るという意味。生成したい文字数が１６の文字列になる
    //         const randomMoji = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が１６こ選ばれる
    //             .map((n) => S[n % S.length])
    //             .join("");
    //         const fileName = randomMoji + "_" + inputImage.name;
    //         // firebase storageに登録する処理
    //         const uploadTweetImg = storage.ref(`${STORAGE}/${fileName}`).put(inputImage);

    //         // firebaseのDBに登録する処理
    //         uploadTweetImg.on(
    //             firebase.storage.TaskEvent.STATE_CHANGED,
    //             // 3つ設定できる。進捗度合い = プログレス。エラーに関する = アップロードがうまくいかないなどのエラーを管理する。
    //             // 成功した時 async（非同期＝何かを実行した後に次のことをするためのもの）

    //             () => { }, //進捗度合いの管理するもの、
    //             (err) => {
    //                 //エラーに関する処理
    //                 alert(err.message);
    //             },
    //             async () => {
    //                 //成功したとき
    //                 await storage
    //                     .ref(STORAGE)
    //                     .child(fileName)
    //                     .getDownloadURL()
    //                     .then(async (url) => {
    //                         await db.collection(DB).add({
    //                             image: url,
    //                             image_name: fileName,
    //                             text: drinkMessage,
    //                             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //                         });
    //                     });
    //             }
    //         );
    //     } else {
    //         db.collection(DB).add({
    //             image: "",
    //             image_name: "",
    //             text: drinkMessage,
    //             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //         });
    //     }
    //     setDrinkMessage("");
    // };

    return (
        <div className="app">

            <div>
                <input type="file" accept="image/*" />
                <button type="submit" >送信</button>
                {/* <input type="file" accept="image/*" disabled={isResizing} onChange={onImageChange}/>
                <button type="submit" onClick={onSubmit}>送信</button> */}
                </div>


            </div>

            );
};

            export default Test_TweetInput_1;