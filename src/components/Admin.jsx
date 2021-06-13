import React from 'react'
import { Link } from "react-router-dom"
import Admin_Feed from './Admin_Feed'
import Admin_InputImages from './Admin_InputImages'

const Admin = () => {
    return (
        <div>
            <p>Home画面の画像登録</p>
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
