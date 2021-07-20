import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { useHistory } from 'react-router-dom';
import ReactImageBase64 from "react-image-base64"

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import Icon_Feed from "./Icon_Feed"
import { toBlobFunction, getModalStyle } from "./Function/Functions"

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: "350px",
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const Drink_NowTweet = ({ id, DB, STORAGE, STORAGE2, uid }) => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle(50, 50));
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState({ data: [] });

    const [userData, setUserData] = useState([{
        id: "",
        admin: "",
        email: "",
        image: "",
        image_name: "",
        nickname: "",
        uid: "",
        timestamp: null,
    }]);

    const getUserData = (uidInfo) => {
        const firebase = db
            .collection("users")
            .where('uid', '==', uidInfo)
            // .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) =>
                setUserData(
                    //data()はfirebaseで指定されたコード記載方法
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        admin: doc.data().admin,
                        email: doc.data().email,
                        image: doc.data().image,
                        image_name: doc.data().image_name,
                        nickname: doc.data().nickname,
                        uid: doc.data().uid,
                        timestamp: doc.data().timestamp
                    }))
                )
            )
    }

    useEffect(() => {
        getUserData(uid)
    }, []); //最初に一度Firebaseにアクセスすることを意味する

    const history = useHistory()
    const loginUser = (e) => {
        auth.onAuthStateChanged(user => {
            !user && history.push("loginDrink");
        });
    }

    const handleOpen = () => {
        loginUser();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const sendNewTweet = async (e) => {
        if (images.data.length > 0) {
            const image = images.data[0].fileData
            const S =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補、62文字
            const N = 16; //16文字の文字列を作るという意味。生成したい文字数が１６の文字列になる
            const randomMoji = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が１６こ選ばれる
                .map((n) => S[n % S.length])
                .join("");
            const fileName = randomMoji + "_" + image.name;

            // Blob形式のFileに変換後に、firebase storageに登録する処理
            let blobData = toBlobFunction(image)
            const uploadTweetImg = storage.ref(`${STORAGE2}/${fileName}`).put(blobData);

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
                        .ref(STORAGE2)
                        .child(fileName)
                        .getDownloadURL()
                        .then(async (url) => {
                            await
                                db.collection(DB).doc(id).collection("imairu").add({
                                    // id_name: idName,
                                    // user:user,//★
                                    image: url,
                                    image_name: fileName,
                                    uid: uid,
                                    icon: userData[0].image,
                                    nickname: userData[0].nickname,
                                    // text: comment,
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                });
                            setImages({ data: [] });
                            document.querySelector('#js-image-base64').value = '';
                        });
                }
            );
        }
        else {
            db.collection(DB).doc(id).collection("imairu").add({
                // id_name: idName,
                // user: user,//★
                image: "",
                image_name: "",
                uid: uid,
                icon: userData[0].image,
                nickname: userData[0].nickname,
                // text: comment,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setImages({ data: [] });
        }
        handleClose();
    };

    const body = (
        <div style={modalStyle} className={classes.paper}>
            {uid &&
                (<Icon_Feed
                    DB="users"
                    STORAGE="images_users"
                    uid={uid}
                    honorific="さん"
                    greet="、おつかれさまです"

                />)
            }

            <div className="center">
                <p className="comment0">自分がいることを投稿して友達を誘おう<br />今日の後ろ姿も投稿できます</p>

                <div className="comment2">後ろ姿:
                    <ReactImageBase64
                        maxFileSize={10485760}
                        thumbnail_size={100}
                        // drop={true}
                        // dropText="ファイルをドラッグ＆ドロップもしくは"
                        // capture="environment"
                        // multiple={true}
                        handleChange={data => {
                            if (data.result) {
                                let list = images.data
                                list.push(data);
                                setImages({ data: list })
                            } else {
                                // setErrors([...errors, data.messages]);
                            }
                        }}
                    /></div>
            </div>

            <div className="center">
                {images.data.map((image, index) => (
                    <img src={image.fileData} alt={"sugoi"} width={70} className="tweet_image" />
                ))}
            </div>

            <div className="center">
                <button type="button" onClick={sendNewTweet}>
                    「今いる！」ことを投稿
                </button>
            </div>
            <div className="right">
                <button onClick={handleClose}>×</button>
            </div>
        </div>
    );

    return (
        <>
            <div className="imairu_button">
                <button type="button" onClick={handleOpen}>
                    「今いる！」
                </button>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
            >
                {body}
            </Modal>
        </>
    );
}

export default Drink_NowTweet