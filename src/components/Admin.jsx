import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { db, auth } from "../firebase";


import Admin_Feed from './Admin_Feed'
import Admin_InputImages from './Admin_InputImages'

const Admin = (props) => {
    useEffect(() => {
        // onAuthStateChanged→何らかのユーザー認証変化があったら実行される
        // その際に[user]内に格納される＝空だったら何も起こらない→つまりログインされていない状態
        const unSub = auth.onAuthStateChanged((user) => {
            // あるときは user = true ,
            // ないときは !user = false
            // !user = falseとなる、つまりユーザーがログインしていない状態の時はログインページに飛ばす
            !user && props.history.push("login");
        });
        return () => unSub();
    }, []);

    return (
        <div>
            <p>Home画面の画像登録</p>
            <button
                onClick={async () => {
                    try {
                        await auth.signOut();
                        props.history.push("/"); //ここでログアウトして飛ばしたいページに戻す
                    } catch (error) {
                        alert(error.message);
                    }
                }}
            >
                管理者ログアウト
            </button>

            <p><Link to="/">Homeへ</Link></p>
            <Admin_InputImages
                DB="homes"
                STORAGE="images_admin" />
            <hr />
            <Admin_Feed
                DB="homes"
                STORAGE="images_admin" />
        </div>
    )
}

export default Admin
