import React, { useState, useEffect } from "react";
import { Link, useHistory, Route, withRouter } from "react-router-dom"

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import { toBlobFunction, getModalStyle, createChatRoom } from "./Function/Functions"

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

const Conversation_ButtonNext = () => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle(50, 50));
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const history = useHistory()

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <p className="comment0 center">新しい友達とチャットしよう</p>
            <p className="comment2 center">投稿時にはユーザ登録が必要です</p>
            <div className="center">
            <button  onClick={() => history.push("/loginConversation")}>ユーザログイン</button>
            </div>
            {/* <button type="button" onClick={handleClose}>× Close</button> */}
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

export default Conversation_ButtonNext