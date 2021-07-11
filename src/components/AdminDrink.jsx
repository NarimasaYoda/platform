import React, { useState, useEffect } from 'react'
import { storage, db, auth } from "../firebase";
import { Link, useHistory } from "react-router-dom"

import Admin_InputPubs from './Admin_InputPubs'
import Admin_Feed from './Admin_Feed'
import Icon_Feed from "./Icon_Feed"
import Admin_Check from "./Admin_Check"
import Logout from "./Logout"

const AdminDrink = () => {
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
            <p>Drink画面のお店情報登録</p>
            <Logout JumpTo = "/"/>
            
            <Link to="/Admin">Adminへ</Link><span>  </span>
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
