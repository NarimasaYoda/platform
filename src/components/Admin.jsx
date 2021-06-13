import React from 'react'
import { Link } from "react-router-dom"
import Admin_Feed from './Admin_Feed'
import Admin_InputImages from './Admin_InputImages'

const Admin = () => {
    return (
        <div>
            <p>Home画面の画像登録</p>
            <Admin_InputImages/>
            <hr/>
            <Admin_Feed/>
            <p><Link to="/">Homeへ</Link></p>
        </div>
    )
}

export default Admin
