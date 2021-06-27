import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { useHistory } from 'react-router-dom';
import ReactImageBase64 from "react-image-base64"

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';


const getModalStyle = () => {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 600,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const Drink_Modal = ({ id, DB, STORAGE }) => {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState({ data: [] });
    const [idName, setIdName] = useState("");
    const [comment, setComment] = useState("");

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIdName("");
        setComment("");
    };

    const clearImages = () => {
        setImages({ data: [] })
    }

    const history = useHistory()
    const loginUser = (e) => {
        auth.onAuthStateChanged(user => {
            // ログイン状態の場合、currentUserというステート（変数）にAPIから取得したuser情報を格納
            // ログアウト状態の場合、ログインページ（loginEvent）へリダイレクト
            !user && history.push("loginDrink");
        });
    }

    const sendNewTweet = async (e) => {
        loginUser();
        e.preventDefault();
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
                                db.collection(DB).doc(id).collection("imairu").add({
                                    id_name: idName,
                                    image: url,
                                    image_name: fileName,
                                    text: comment,
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                });
                            setIdName("");
                            setComment("");
                            console.log(images);
                        });
                }
            );
        }
        else {
            db.collection(DB).doc(id).collection("imairu").add({
                id_name: idName,
                image: "",
                image_name: "",
                text: comment,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setIdName("");
            setComment("");
        }

        handleClose();

    };

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <div className="items2">
                <input
                    type="text"
                    placeholder="ネーム入力"
                    autoFocus
                    value={idName}
                    onChange={(e) => setIdName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="コメント入力"
                    autoFocus
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                
                <br/><p>今日の後ろ姿 : </p>
                <ReactImageBase64
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
            </div>

            <div>
                {images.data.map((image, index) => (
                    <img src={image.fileData} alt={"sugoi"} width={70} className="tweet_image" />
                ))}
            </div>

            <div>
                <button type="button" disabled={!idName} onClick={sendNewTweet}>
                    「今いる！」の投稿
                </button>
            </div>

            {/* <div className="items2">
                    <input type="file" name="file" onChange={onChangeImageHandler} />
                </div> */}

            <div>
                <button type="button" onClick={clearImages}>
                    {/* <button type="button" disabled={!(images==={ data: [] })} onClick={clearImages}> */}
                    {/* //disableできない・・・。 */}
                    投稿画像削除
                </button>
            </div>

            <button type="button" onClick={handleClose}>
                × Close
            </button>
        </div>
    );

    return (
        <div>
            <button type="button" onClick={handleOpen}>
                「今いる！」
            </button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                {body}
            </Modal>
        </div>
    );
}

export default Drink_Modal