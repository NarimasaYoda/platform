import React, { useState } from "react";
import firebase from "firebase/app";
import { storage, db } from "../firebase";
import { useHistory } from 'react-router-dom';
import ReactImageBase64 from "react-image-base64"

const Admin_InputPubs = ({ DB, STORAGE }) => {

    const [images, setImages] = useState({ data: [] });
    
    const [tagName, setTagName] = useState("");
    const [itemInitial, setItemInitial] = useState("");
    const [itemFullName, setItemFullName] = useState("");
    const [itemComment, setItemComment] = useState("");
    const [comments, setComments] = useState("");


    const sendTweet = async (e) => {
        e.preventDefault();
        if (images) {
            const image = images.data[0].fileData
            const S =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補、62文字
            const N = 16; //16文字の文字列を作るという意味。生成したい文字数が16の文字列になる
            const randomMoji = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が16個選ばれる
                .map((n) => S[n % S.length])
                .join("");
            const fileName = randomMoji + "_" + Image.name;

            console.log(image);

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

                                tag_name:tagName,
                                item_initial:itemInitial,
                                item_fullName:itemFullName,
                                item_comment:itemComment,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            });
                            setTagName("");
                            setItemInitial("");
                            setItemFullName("");
                            setItemComment("");
                            setComments("");
                            console.log(images);
                        });
                }
            );
        } else {
            db.collection(DB).add({
                image: "",
                image_name: "",
                text: comments,

                tag_name:tagName,
                item_initial:itemInitial,
                item_fullName:itemFullName,
                item_comment:itemComment,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setTagName("");
            setItemInitial("");
            setItemFullName("");
            setItemComment("");
            setComments("");
        }
    };

    const clearImages = () => {
        setImages({ data: [] })
    }

    return (
        <div className="event">
            <form className="items">
                <div>
                    <input
                        type="text"
                        placeholder="例：GTJZ"
                        autoFocus
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="例：G（イニシャル）"
                        autoFocus
                        value={itemInitial}
                        onChange={(e) => setItemInitial(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="例：後藤醸造"
                        autoFocus
                        value={itemFullName}
                        onChange={(e) => setItemFullName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="例：立ち飲み"
                        autoFocus
                        value={itemComment}
                        onChange={(e) => setItemComment(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="例：東京農大出身のご夫婦が作るクラフトビール"
                        autoFocus
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />

                    <ReactImageBase64
                        maxFileSize={10485760}
                        thumbnail_size={1000}
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
                        <img src={image.fileData} alt={"sugoi"} width={100} className="tweet_image" />
                    ))}
                </div>

                <div>
                    <button type="button" disabled={!tagName&&!itemInitial&&!itemFullName&&!itemComment&&!comments} onClick={sendTweet}>
                        「コメント＆画像」の投稿
                    </button>
                </div>

                <div>
                    <button type="button" onClick={clearImages}>
                        {/* <button type="button" disabled={!(images==={ data: [] })} onClick={clearImages}> */}
                        {/* //disableできない・・・。 */}
                        投稿画像削除
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Admin_InputPubs;