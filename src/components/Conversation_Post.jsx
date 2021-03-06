import React, { useState, useEffect } from 'react'
import firebase from "firebase/app";
import { storage, db, auth } from "../firebase";
import { useHistory } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const Conversation_Post = ({ key, id, uid, DB, room_name, uid1, uid2, user1, user2, user1_image, user2_image, timestamp, STORAGE }) => {

    console.log(uid, uid1, uid2, user1, user2, user1_image, user2_image, "※すべて")
    console.log(uid2, user2, "★u2最初")

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([
        {
            id: "",
            uid: "",
            user: "",
            user_image: "",
            text: "",
            timestamp: null,
        },
    ]);
    const [userCheckFlag, setUserCheckFlag] = useState(false)
    const [userCheckFlag2, setUserCheckFlag2] = useState(false)

    const history = useHistory()
    const loginUser = (e) => {
        auth.onAuthStateChanged(user => {
            !user && history.push("login");
        });
    }

    const getCommentsData = () => {
        if (!id) return false;  //追記★
        const firebaseData = db
            .collection(DB)
            .doc(id)
            .collection("conversation")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>
                setComments(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        uid: doc.data().uid,
                        user: doc.data().user,
                        user_image: doc.data().user_image,
                        text: doc.data().text,
                        timestamp: doc.data().timestamp,
                    }))
                )
            );
        return () => {
            firebaseData();
        };
    }

    useEffect(() => {
        getCommentsData()
    }, [id]);

    const handleAddNewComment = (e) => {
        db.collection(DB).doc(id).collection("conversation").add({
            uid: uid === uid1 ? uid1 : uid2,
            user: uid === uid1 ? user1 : user2,
            user_image: uid === uid1 ? user1_image : user2_image,
            text: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment("");
    };


    const nameSide = (uidData) => {
        if (uidData === uid1) {
            return "mySideName"
        } else {
            return "yourSideName"
        }
    }

    const chatSide = (uidData) => {
        if (uidData === uid) {
            return "mySideChat"
        } else {
            return "yourSideChat"
        }
    }

    return (
        <>
            <div className="chatroom center">
                <div className="chatName" className={nameSide(uid)}>
                    <p className="comment1">「{user1}」さん</p>
                    <p className="comment1">「{user2}」さん</p>
                </div>

                <div className="chatroom_comments center">
                    {comments &&
                        comments.map((comment) => (
                            <div className={chatSide(comment.uid)}>
                                <div className="chat_container">
                                    <p className="comment2">
                                        <span className="comment3">
                                            {new Date(comment.timestamp?.toDate()).toLocaleString()}<span> : </span>
                                        </span>
                                        {comment.text}
                                    </p>

                                </div>
                            </div>
                        ))}
                </div>
                <input
                    type="text"
                    placeholder="コメントを記述"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    type="button"
                    disabled={!comment}
                    onClick={handleAddNewComment}>
                    コメントを投稿する
                </button>
            </div>
        </>
    );
};

export default Conversation_Post

