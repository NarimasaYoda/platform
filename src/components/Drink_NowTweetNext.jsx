import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

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

const Drink_NowTweetNext = () => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle(50, 50));
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState({ data: [] });

    const history = useHistory()

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <div style={modalStyle} className={classes.paper}>
                <p className="comment1">「今いる」ことを投稿して、友達を呼ぼう</p>
                <p className="comment3">投稿時にはユーザ登録が必要です</p>
                <button onClick={() => history.push("/loginDrink")}>ユーザログイン</button>
                {/* <button type="button" onClick={handleClose}>× Close</button> */}
            </div>
            <button type="button" onClick={handleClose}>× Close</button>
        </div>
    );

    return (
        <>
            <button type="button" onClick={handleOpen}>
                「今いる！」
            </button>

            <Modal
                open={open}
                onClose={handleClose}
            >
                {body}
            </Modal>
        </>
    );
}

export default Drink_NowTweetNext