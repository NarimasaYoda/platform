import React, { useState, useEffect } from "react";
import { storage, db, auth } from "../firebase";
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import { toBlobFunction, getModalStyle, createChatRoom } from "./Function/Functions"

import Img from "../images/no_image.png";

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: "350px",
        height: "300px",
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const Conversation_Button = ({ id, DB, STORAGE, STORAGE2, uid }) => {
    // DB="chats"
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle(50, 50));
    const [open, setOpen] = useState(false);
    // ***************************
    const [createChatRoomFlag, setCreateChatRoomFlag] = useState(false);
    const [otherUsers, setOtherUsers] = useState([{
        id: "",
        admin: "",
        email: "",
        image: "",
        image_name: "",
        nickname: "",
        uid: "",
        timestamp: null,
    }]);

    const [otherUsersSort, setOtherUsersSort] = useState([{
        id: "",
        admin: "",
        email: "",
        image: "",
        image_name: "",
        nickname: "",
        uid: "",
        timestamp: null,
    }]);

    const [currentUser, setCurrentUser] = useState([{
        nickname: "",
        image: "",
        id: "",
    }]);

    const [chatRooms, setChatRooms] = useState([{
        id: "",
        uid1: "",
        uid2: "",
        user1: "",
        user2: "",
        user1_image: "",
        user2_image: "",
        timestamp: null,
    }]);
    // ***************************
    const history = useHistory()
    const loginUser = (e) => {
        auth.onAuthStateChanged(user => {
            !user && history.push("loginConversation");
        });
    }

    const handleOpen = () => {
        loginUser();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    // ***************************
    const getOtherUsersData = (uidInfo) => {
        const firebase = db
            .collection(DB)
            .where('uid', '!=', uidInfo) //自分ではないuserを選択
            // .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) =>
                setOtherUsers(
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

    const getCurrentUserData = (uidInfo) => {
        const firebase = db
            .collection(DB)
            .where('uid', '==', uidInfo) //自分選択
            .onSnapshot((snapshot) =>
                setCurrentUser(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        image: doc.data().image,
                        nickname: doc.data().nickname,
                    }))
                )
            )
    }

    const getChatRoomsData = () => {
        const firebase = db
            .collection("chats")
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) =>
                setChatRooms(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        uid1: doc.data().uid1,
                        uid2: doc.data().uid2,
                        user1: doc.data().user1,
                        user2: doc.data().user2,
                        user1_image: doc.data().user1_image,
                        user2_image: doc.data().user2_image,
                        timestamp: doc.data().timestamp
                    }))
                )
            )
    }

    useEffect(() => {
        getOtherUsersData(uid);
        getCurrentUserData(uid);
    }, [])

    useEffect(() => {
        let otherUsers_sort = otherUsers
        otherUsers_sort.sort(function (a, b) {
            if (a.timestamp < b.timestamp) { //"<"">"で順番を変える
                return -1;
            } else {
                return 1;
            }
        });
        setOtherUsersSort(otherUsers_sort)
        // console.log(otherUsers, "➀otherUsers");
        // console.log(otherUsersSort, "➁otherUsersSort");
    }, [otherUsers])

    useEffect(() => {
        getChatRoomsData();
    }, [createChatRoomFlag])

    const createRoom = (index) => {
        setCreateChatRoomFlag(!createChatRoomFlag)

        const uid1 = uid
        const uid2 = otherUsersSort[index].uid
        const user1 = currentUser[0].nickname
        const user2 = otherUsersSort[index].nickname
        const user1_image = currentUser[0].image
        const user2_image = otherUsersSort[index].image

        let i_flag = 0
        for (let i = 0; i < chatRooms.length; i++) {
            (chatRooms[i].uid1 + chatRooms[i].uid2) === (uid1 + uid2) ? i_flag = i_flag + 1 : i_flag = i_flag;
            (chatRooms[i].uid1 + chatRooms[i].uid2) === (uid2 + uid1) ? i_flag = i_flag + 1 : i_flag = i_flag;
        }

        if (i_flag === 0) {
            createChatRoom("chats", uid1, uid2, user1, user2, user1_image, user2_image)
            i_flag = 0
        } else {
            i_flag = 0
        }
        setOpen(false);
    }
    // ***************************

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <p className="comment0" className="title">新しい友達とチャットしよう</p>

            <div className="imairu">
                {otherUsersSort && otherUsersSort.map((postId, index) => (
                    <div className="items">
                        {postId.image && <img src={postId.image} alt="" className="post_image" onClick={() => createRoom(index)} />}
                        {!postId.image && <img src={Img} alt="" className="post_image" onClick={() => createRoom(index)} />}
                        <span className="comment2">{postId.nickname}</span>
                    </div>
                ))}
            </div>

            <div className="right">
                <button onClick={handleClose}>×</button>
            </div>
        </div>
    );

    return (
        <>
            <div>
                <button type="button" onClick={handleOpen}>
                    新しい友達と新規ルーム作成
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

export default Conversation_Button