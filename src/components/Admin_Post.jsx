import React, { useState, useEffect } from "react";
import Img from "../images/test.png";
import { storage, db } from "../firebase";

// Post（プロップスを受け取って表示する方）
const Admin_Post = ({ key, id, date, event, image, image_name, text, tag_name,
  item_initial, item_fullName, item_comment, timestamp, DB, STORAGE }) => {

  const deleteData = () => {
    db.collection(DB).doc(id).delete();
    storage.ref(`${STORAGE}/${image_name}`).delete();
  }

  return (
    <>
      <div className="event">
        <div className="items">
          <p className="comment1">
            {text}/{tag_name}/{item_initial}/{item_fullName}/{item_comment}
          </p>
          <div className="comment3">
            投稿：{new Date(timestamp?.toDate()).toLocaleString()}
            <button onClick={deleteData}>削除</button>
          </div>

          {/* 画像があるとき */}
          {image && <img src={image} alt="" className="post_image" />}
          {/* 画像ない時 */}
          {!image && <img src={Img} alt="" className="post_image" />}
        </div>
      </div>

    </>
  );
};

export default Admin_Post;