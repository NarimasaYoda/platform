import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import Img from "../images/test.png";

// ************************************
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
// ************************************

// Post（プロップスを受け取って表示する方）
const Drink_Now = ({ key, id, DB, STORAGE, STORAGE2 }) => {

    const [imairuInfo, setImairuInfo] = useState([{
        id: "",
        id_name: "",
        image: "",
        image_name: "",
        uid: "",
        text: "",
        timestamp: null,
    },]);

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!id) return false;  //追記 全部にコメントが投稿されているかどうかでハンドリングしないといけない。

        const firebaseData = db
            .collection(DB)
            // ポイントです！
            .doc(id)
            .collection("imairu")
            .orderBy("timestamp", "asc")
            .onSnapshot((snapshot) =>
                setImairuInfo(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,

                        id_name: doc.data().id_name,
                        image: doc.data().image,
                        image_name: doc.data().image_name,
                        uid: doc.data().uid,
                        text: doc.data().text,
                        timestamp: doc.data().timestamp,
                    }))
                )
            );
        return () => {
            firebaseData();
        };
    }, [id]);

    const history = useHistory()
    const loginUser = (e) => {
        auth.onAuthStateChanged(user => {
            // ログイン状態の場合、currentUserというステート（変数）にAPIから取得したuser情報を格納
            // ログアウト状態の場合、ログインページ（loginEvent）へリダイレクト
            !user && history.push("loginDrink");
        });
    }

    const windowOpenFunc = () => {
        console.log("img","this.name")
        loginUser();
        setOpen(true);
    }

    return (
        <div className="imairu">
            {imairuInfo && imairuInfo.map((info,index) => (
                <div className="items">
                    {/* 画像があるとき */}
                    {info.image && <img src={info.image} alt="" className="post_image" name={info.id} onClick={() => windowOpenFunc()} />}
                    {/* 画像ない時 */}
                    {!info.image && <img src={Img} alt="" className="post_image" name={info.id} onClick={() => windowOpenFunc()} />}
                </div>
            ))}
        </div>
    );
};

export default Drink_Now;