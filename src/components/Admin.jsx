import React, { useState, useEffect } from 'react'
import { storage, db, auth } from "../firebase";
import { Link, useHistory } from "react-router-dom"

import Admin_InputImages from './Admin_InputImages'
import Admin_Feed from './Admin_Feed'
import Icon_Feed from "./Icon_Feed"
import Admin_Check from "./Admin_Check"
import Logout from "./Logout"

const Admin = () => {
    const [currentUser, setCurrentUser] = useState("")

    const history = useHistory()

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user === null) {
                setCurrentUser("");
            } else {
                setCurrentUser(user);
            }
        });
    }, [])

    useEffect(() => {
        // onAuthStateChanged→何らかのユーザー認証変化があったら実行される
        const unSub = auth.onAuthStateChanged((user) => {
            !user && history.push("/login");
        });
        return () => unSub();
    }, []);

    return (
        <div>
            <p>Home画面の画像登録</p>
            <Logout JumpTo = "/"/>

            <Link to="/AdminDrink">AdminDrinkへ</Link><span>  </span>
            <Link to="/">Homeへ</Link>

            {currentUser && //★ポイント uid取得後に可能となる
                (<Icon_Feed
                    DB="users"
                    STORAGE="images_users"
                    uid={currentUser.uid}
                />)
            }

            {currentUser &&
                (<Admin_Check
                    DB="users"
                    uid={currentUser.uid}
                />)
            }

            <hr />
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
