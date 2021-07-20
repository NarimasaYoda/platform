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
        width: "300px",
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
        // user: "",//★
        image: "",
        image_name: "",
        uid: "",
        icon: "",
        nickname: "",
        timestamp: null,
    },]);

    // ************************
    const getImairuData = (id) => {
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
                        // user: doc.data().user,//★
                        image: doc.data().image,
                        image_name: doc.data().image_name,
                        uid: doc.data().uid,
                        icon: doc.data().icon,
                        nickname: doc.data().nickname,
                        timestamp: doc.data().timestamp,
                    }))
                )
            );
        return () => {
            firebaseData();
        };
    }

    useEffect(() => {
        getImairuData(id);
    }, [id]);

    // ****************************

    const history = useHistory()
    const loginUser = (e) => {
        auth.onAuthStateChanged(user => {
            !user && history.push("loginDrink");
        });
    }

    const windowOpenFunc = (index) => {
        setOpen(true);
        setTargetIndex(index);//★
    }

    const handleClose = () => {
        setOpen(false);
        setTargetIndex(null);
    };

    const body = (
        <div style={modalStyle} className={classes.paper}>
            {imairuInfo[targetIndex] && (
                <>
                    <Icon_Feed
                        DB="users"
                        STORAGE="images_users"
                        uid={imairuInfo[targetIndex]["uid"]}
                        honorific="さん"
                        greet="、この店にいます"
                    />
                    <div className="center">
                        <p className="comment1">{imairuInfo[targetIndex]["nickname"]} さん、今日はこの後ろ姿です</p>
                        {/* 画像があるとき */}
                        {imairuInfo[targetIndex]["image"] && <img src={imairuInfo[targetIndex]["image"]} alt="" className="post_image" />}
                        {/* 画像ない時 */}
                        {!imairuInfo[targetIndex]["image"] && <img src={Img} alt="" className="post_image" />}
                        <p className="comment3">{new Date(imairuInfo[targetIndex]["timestamp"]?.toDate()).toLocaleString()} の投稿情報です</p>
                    </div>
                </>
            )}
            <div className="right">
                <button onClick={handleClose}>×</button>
            </div>
        </div >
    );
    return (
        <div className="imairu">
            {imairuInfo && imairuInfo.map((info, index) => (
                <div className="items">
                    {/* 画像があるとき */}
                    {info.icon && <img src={info.icon} alt="" className="post_image" onClick={() => windowOpenFunc(index)} />}
                    {/* 画像ない時 */}
                    {!info.icon && <img src={Img} alt="" className="post_image" onClick={() => windowOpenFunc(index)} />}
                    <span className="comment3">{info.nickname}</span>
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