import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import Test_Post from "./Test_Post";

const Test_Feed = () => {

    const [fbData, setFbData] = useState([{
        text: "",
        image: "",
    }]);

    useEffect(() => {
        const firebaseData = db
            .collection('tests')
            .onSnapshot((snapshot) =>
                setFbData(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        text: doc.data().text,
                        image: doc.data().image,
                    }))
                )
            )
    }, []); //最初に一度Firebaseにアクセスすることを意味する

    return (
        <div>
            {fbData.map((data_a) => (

                <Test_Post
                    id={data_a.id}
                    text={data_a.text}
                    image={data_a.image}
                />
            ))}
        </div>
    )
}
export default Test_Feed