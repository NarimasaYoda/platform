import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { db, auth } from "../firebase";

import Admin_Feed from './Admin_Feed'
import Admin_InputPubs from './Admin_InputPubs'

const AdminDrink = (props) => {
    useEffect(() => {
        // onAuthStateChanged→何らかのユーザー認証変化があったら実行される
        // その際に[user]内に格納される＝空だったら何も起こらない→つまりログインされていない状態
        const unSub = auth.onAuthStateChanged((user) => {
            // あるときは user = true ,
            // ないときは !user = false
            // !user = falseとなる、つまりユーザーがログインしていない状態の時はログインページに飛ばす
            !user && props.history.push("/login");
        });
        return () => unSub();
    }, []);

    return (
        <div>
            <p>Drink画面のお店情報登録</p>
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
            <Link to="/Admin">Adminへ</Link> 
            
            <span>  </span>

            <Link to="/">Homeへ</Link>
            <Admin_InputPubs
                DB="pubs"
                STORAGE="images_pubs" />
            <hr />
            <Admin_Feed
                DB="pubs"
                STORAGE="images_pubs" />
        </div>
    )
}

export default AdminDrink
