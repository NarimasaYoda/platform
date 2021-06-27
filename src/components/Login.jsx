import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { Link } from "react-router-dom"
import ReactImageBase64 from "react-image-base64"

const Login = (props) => {
    //ログイン状態の保持、メールの状態を保持、パスワードの状態を保持
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [images, setImages] = useState({ data: [] });
    const [currentUser, setCurrentUser] = useState("")
    const [isAuthChg, setIsAuthChg] = useState(true)

    const DB = "users"
    const STORAGE = "images_users"

    // useEffectを使って読み込み時に状態を判断する、phpでのセッションに相当するイメージ
    // userというパラメータがあり、これには「ログインに成功した時に」この部分に全部格納される。
    // userに何かしらの情報が入っていればログインに成功、入っていなければログイン失敗、ログインしていないということ。

    useEffect(() => {
        const unSub = auth.onAuthStateChanged((user) => {
            // 判定の条件は、何らかの情報が入っていた時、ルートの画面Appに遷移させる。
            // 逆にいうと、userにない場合はこの画面にとどまり続ける。push("/") ログインしている人が到達するページ
            user && props.history.push("/");
        });
        return () => unSub();
    }, [props.history]);


    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user == null) {
                setCurrentUser("")
            } else {
                setCurrentUser(user);
            }
        });
    }, [isAuthChg]) //★これも使い方が怪しい

    const setUserInfo = async (e) => {
        // e.preventDefault();
        if (images) {
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

            console.log(image)

            // ******base64文字列（リサイズ後）をBlob形式のFileに変換する。******
            const toBlob = (base64) => {
                const bin = atob(base64.replace(/^.*,/, ''));
                const buffer = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) {
                    buffer[i] = bin.charCodeAt(i);
                }
                // Blobを作成
                try {
                    var blob = new Blob([buffer.buffer], {
                        type: 'image/png'
                    });
                } catch (e) {
                    return false;
                }
                return blob;
            }
            // ******************************************************************

            // Blob形式のFileに変換後に、firebase storageに登録する処理
            let blobData = toBlob(image)
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
                                    uid: currentUser,  //★このuidが取得できない。
                                    image: url,
                                    image_name: fileName,
                                    nickname: nickname,
                                    admin:0, //★admin 0 or 1
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                });
                            setCurrentUser("");
                            setNickname("");
                            console.log(images);
                        });
                }
            );
        }
        else {
            db.collection(DB).add({
                uid: currentUser,
                image: "",
                image_name: "",
                nickname: nickname,
                admin:0, //★admin 0 or 1
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setCurrentUser("");
            setNickname("");
        }


        console.log("AAA")
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
                                // ログイン時 firebaseに[signInWithEmailAndPassword]というものがある。
                                // それにemail, passwordで保持した状態を送り、成功すればhistoryによって画面遷移が実行される
                                await auth.signInWithEmailAndPassword(email, password);
                                props.history.push("/");
                            } catch (error) {
                                // ログインできない、失敗したときはエラーで表示される
                                alert(error.message);
                            }
                        }
                        :
                        async () => {
                            try {
                                // 登録時 firebaseに[createUserWithEmailAndPassword]というものがある。
                                // それにemail, passwordで保持した状態を送り、成功すればhistoryによって画面遷移が実行される
                                await auth.createUserWithEmailAndPassword(email, password);

                                { setUserInfo() } //★特にここが怪しい。firebaseのAuthで、IDを作って、「uidができた」のちに、アイコン画像を格納したい。

                                // props.history.push("/");

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

        </div>
    );
};
export default Login;