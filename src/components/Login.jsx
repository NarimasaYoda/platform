import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { Link } from "react-router-dom"

const Login = (props) => {
    //ログイン状態の保持、メールの状態を保持、パスワードの状態を保持
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // useEffectを使って読み込み時に状態を判断する、phpでのセッションに相当するイメージ
    // userというパラメータがあり、これには「ログインに成功した時に」この部分に全部格納される。
    // userに何かしらの情報が入っていればログインに成功、入っていなければログイン失敗、ログインしていないということ。
    useEffect(() => {
        const unSub = auth.onAuthStateChanged((user) => {
            // 判定の条件は、何らかの情報が入っていた時、ルートの画面Appni遷移させる。
            // 逆にいうと、userにない場合はこの画面にとどまり続ける。push("/") ログインしている人が到達するページ
            user && props.history.push("/");
        });
        return () => unSub();
    }, [props.history]);

    return (
        <div>
            <h1>{isLogin ? "Login" : "Register"}</h1>
            <hr />
            Email:<input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <hr />
            Password:<input
                type="password"
                name="password" //html5に用意されいてる
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <hr />
            <button
                onClick={
                    isLogin
                        ? async () => {
                            try {
                                // ログイン時 firebaseに[signInWithEmailAndPassword]というものがある。
                                // それにemail, passwordで保持した状態を送り、成功すればhistoryによって画面遷移が実行される
                                await auth.signInWithEmailAndPassword(email, password);
                                props.history.push("admin");
                            } catch (error) {
                                // ログインできない、失敗したときはエラーで表示される
                                alert(error.message);
                            }
                        }
                        :
                        async () => {
                            try {
                                // 登録時 firebaseに[createUserWithEmailAndPassword]というものがある。
                                // それにemail, passwordで保持した状態を送り、成功すればhistoryによって画面遷移が実行される
                                await auth.createUserWithEmailAndPassword(email, password);
                                props.history.push("admin");
                            } catch (error) {
                                // ログインできない、失敗したときはエラーで表示される
                                alert(error.message);
                            }
                        }
                }
            >
                {isLogin ? "ログインする" : "登録する"}
            </button>
            <hr />

            <div onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Create new account ?" : "Back to login"}
            </div>

        </div>
    );
};
export default Login;