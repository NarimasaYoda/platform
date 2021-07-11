import { auth } from "../firebase";
import { useHistory } from "react-router-dom"

const Logout = ({JumpTo}) => {

    const history = useHistory()

    return (
        <button
            onClick={async () => {
                try {
                    await auth.signOut();
                    history.push(JumpTo); //ここでログアウトして飛ばしたいページに戻す
                } catch (error) {
                    alert(error.message);
                }
            }}
        >
            ユーザログアウト
        </button>
    )
}

export default Logout

