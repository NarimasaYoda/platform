import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import Img from "../images/no_image.png";
import { toBlobFunction, getModalStyle } from "./Function/Functions"
import Icon_Feed from "./Icon_Feed"

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

const Drink_NowFeed = ({ key, id, DB, STORAGE, STORAGE2, uid }) => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle(50, 50));
    const [open, setOpen] = useState(false);

    const [targetIndex, setTargetIndex] = useState(null);//★
    // console.log(key, uid, 100)

    const [imairuInfo, setImairuInfo] = useState([{
        id: "",
        id_name: "",
        image: "",
        image_name: "",
        uid: "",
        text: "",
        timestamp: null,
    },]);

    useEffect(() => {
        if (!id) return false;

        const firebaseData = db
            .collection(DB)
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

    const windowOpenFunc = (index) => {
        console.log(imairuInfo[index]["uid"], index)//★//この時にクリックした画像のNameを抽出したい。
        // loginUser();
        setOpen(true);
        setTargetIndex(index);//★
    }

    const handleClose = () => {
        setOpen(false);
        setTargetIndex(null);
    };

    // {imairuInfo[targetIndex]["image"] && <img src={imairuInfo[targetIndex]["image"]} alt="" className="post_image"/>}

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <div className="items2">
                {imairuInfo[targetIndex] && (
                    <>
                        <Icon_Feed
                            DB="users"
                            STORAGE="images_users"
                            uid={imairuInfo[targetIndex]["uid"]}
                        />
                        <p>後ろ姿</p>
                        {/* 画像があるとき */}
                        {imairuInfo[targetIndex]["image"] && <img src={imairuInfo[targetIndex]["image"]} alt="" className="post_image" />}
                        {/* 画像ない時 */}
                        {!imairuInfo[targetIndex]["image"] && <img src={Img} alt="" className="post_image" />}
                    </>

                )}
            </div>
            <button type="button" onClick={handleClose}>× Close</button>
        </div>
    );
    return (
        <div className="imairu">
            {imairuInfo && imairuInfo.map((info, index) => (
                <div className="items">
                    {/* 画像があるとき */}
                    {info.image && <img src={info.image} alt="" className="post_image" onClick={() => windowOpenFunc(index)} />}
                    {/* 画像ない時 */}
                    {!info.image && <img src={Img} alt="" className="post_image" onClick={() => windowOpenFunc(index)} />}
                </div>
            ))}
            <Modal
                open={open}
                index={targetIndex}  //★
                onClose={handleClose}
            >
                {body}
            </Modal>
        </div>
    );
};
export default Drink_NowFeed;