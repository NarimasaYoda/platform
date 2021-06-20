import React from 'react'
import { Link } from "react-router-dom"

import "../styles/style.css";

const Register = () => {
    return (
        <>
            <h1 className="title">登録 Register</h1>
            <div className="register">
                <input
                    // disabled={disabled}
                    placeholder="名前"
                    // value={todoText}
                    // onChange={onChange}

                    // disabled={disabled}
                    // placeholder="入力"
                    // value={todoText}
                    // onChange={onChange}
                />

                <input placeholder="Pass" />
                <input placeholder="駅" />
                <button>
                    {/* <button disabled={disabled} onClick={onClick}> */}

                登録＜Register＞
            </button>
            </div>


            <hr />
            <p><Link to="/">Homeへ</Link></p>
        </>
    )
}

export default Register
