import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { Link } from "react-router-dom"
import { useHistory } from 'react-router-dom';
import ReactImageBase64 from "react-image-base64"
import { toBlobFunction } from "./Function/Functions"

const Login = ({ JumpTo }) => {
    const DB = "users"
    const STORAGE = "images_users"

    //ログイン状態の保持、メールの状態を保持、パスワードの状態を保持
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [images, setImages] = useState({ data: [] });

    const history = useHistory()
    const loginUser = (e) => {
        auth.onAuthStateChanged(user => {
            // ログイン状態の場合、currentUserというステート（変数）にAPIから取得したuser情報を格納
            // ログアウト状態の場合、ログインページ（loginEvent）へリダイレクト
            user && history.push(JumpTo);
        });
    }

    useEffect(() => {
        loginUser();
    }, [])

    // console.log(history, "history")
    // console.log(JumpTo, "JumpTo")
    
    const setUserInfo = async (uid) => {
        // e.preventDefault();
        if (images.data.length > 0) {
            // 画像 + テキストを登録させる。firebaseの仕様で同じファイル名の画像を複数回アップしてしまうと元々あったファイルが削除される。
            // そのためにファイル名をランダムなファイル名を作る必要がある、以下記述のとおり。
            const image = images.data[0].fileData
            const S =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補、62文字
            const N = 16; //16文字の文字列を作るという意味。生成したい文字数が１６の文字列になる
            const randomMoji = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が１６こ選ばれる
                .map((n) => S[n % S.length])
                .join("");
            const fileName = randomMoji + "_" + image.name;
            // console.log(image)

            // Blob形式のFileに変換後に、firebase storageに登録する処理
            let blobData = toBlobFunction(image)
            const uploadTweetImg = storage.ref(`${STORAGE}/${fileName}`).put(blobData);

            // firebaseのDBに登録する処理
            uploadTweetImg.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                // 3つ設定できる。進捗度合い = プログレス。エラーに関する = アップロードがうまくいかないなどのエラーを管理する。
                // 成功した時 async（非同期＝何かを実行した後に次のことをするためのもの）

                () => { }, //進捗度合いの管理するもの、
                (err) => {
                    alert(err.message);
                },
                async () => {
                    //成功したとき
                    await storage
                        .ref(STORAGE)
                        .child(fileName)
                        .getDownloadURL()
                        .then(async (url) => {
                            await
                                db.collection(DB).add({
                                    uid: uid,
                                    image: url,
                                    image_name: fileName,
                                    nickname: nickname,
                                    admin: 0, //★admin 0 or 1
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                });
                            setNickname("");
                            setImages({ data: [] }); //★★★
                            // document.querySelector('#js-image-base64').value = ''//★★★
                            // console.log(images);
                        });
                }
            );
        }
        else {
            db.collection(DB).add({
                uid: uid,
                image: "",
                image_name: "",
                nickname: nickname,
                admin: 0, //★admin 0 or 1
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setNickname("");
            setImages({ data: [] }); //★★★
        }
    }


    return (
        <div>
            <h1>{isLogin ? "Login" : "Register"}</h1>
            <hr />
            Email:<input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <hr />
            Password:<input
                type="password"
                name="password" //html5に用意されいてる
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <hr />
            ニックネーム(初期登録時のみ):<input
                type="text"
                name="name"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />
            <hr />
            アイコン画像(初期登録時のみ):<ReactImageBase64
                maxFileSize={10485760}
                thumbnail_size={50}
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
            <div>
                {images.data.map((image, index) => (
                    <img src={image.fileData} alt={"sugoi"} width={70} className="tweet_image" />
                ))}
            </div>
            <hr />

            <button
                onClick={
                    isLogin
                        ? async () => {
                            try {
                                // ログイン時 [signInWithEmailAndPassword]にemail, passwordで保持した状態を送り成功すればhistoryによって画面遷移が実行される
                                await auth.signInWithEmailAndPassword(email, password);
                                history.push(JumpTo);
                            } catch (error) {
                                // ログインできない、失敗したときはエラーで表示される
                                alert(error.message);
                            }
                        }
                        :
                        async () => {
                            try {
                                // 登録時 [createUserWithEmailAndPassword]にemail, passwordで保持した状態を送り成功すればhistoryによって画面遷移が実行される
                                const authData = await auth.createUserWithEmailAndPassword(email, password);
                                { setUserInfo(authData.user.uid) } //awaitでは、取得して変数に取り込んで”から”次のfunctionに移動する。
                                // .then ((authData.user.uid)=>()) ??? 同期非同期！これでもよい
                                history.push(JumpTo);
                            } catch (error) {
                                // ログインできない、失敗したときはエラーで表示される
                                alert(error.message);
                            }
                        }
                }
            >
                {isLogin ? "ログインする" : "登録する"}
            </button>
            <hr />

            <button onClick={() => setIsLogin(!isLogin)}>
                切替：{isLogin ? "初期登録ページに移動" : "ログインページに移動"}
            </button>
            <p><Link to="/">Homeへ</Link></p>
        </div>
    );
};
export default Login;