import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import Img from "../images/test.png";
import { toBlobFunction, getModalStyle } from "./Function/Functions"

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


const Drink_Now = ({ key, id, DB, STORAGE, STORAGE2 }) => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle(50, 50));
    const [open, setOpen] = useState(false);

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

    const windowOpenFunc = () => {
        console.log("img", "this.name")//この時にクリックした画像のNameを抽出したい。
        // loginUser();
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    // const uid_test = document.getElementById("test_image").name
    // console.log(uid_test,"※uid_test")
    
    const body = (
        <div style={modalStyle} className={classes.paper}>
            {/* {uid} */}
            <div className="items2">
                <p>
                    uid（画像のname属性として設定しているが、それを持ってきたい。）this.image.name??  
                    uid:"zGQvjvAumwOjtB1nDSs8nfLkQqp1"を連携して、uidに関連するuser情報を載せたい<br/>
                    nickname<br/>
                    icon画像<br/>

                </p>

            </div>


            <button type="button" onClick={handleClose}>× Close</button>
        </div>
    );

    return (
        <div className="imairu">
            {imairuInfo && imairuInfo.map((info, index) => (
                <div className="items">
                    {/* 画像があるとき */}
                    {info.image && <img src={info.image} alt="" className="post_image" idName="test_image" name={info.uid} onClick={() => windowOpenFunc()} />}
                    {/* 画像ない時 */}
                    {!info.image && <img src={Img} alt="" className="post_image" idName="test_image" name={info.uid} onClick={() => windowOpenFunc()} />}
                </div>
            ))}

            <Modal
                open={open}
                onClose={handleClose}
            >
                {body}
            </Modal>

        </div>
    );
};

export default Drink_Now;