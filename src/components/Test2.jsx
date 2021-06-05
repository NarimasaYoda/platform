import React, { useState } from 'react'
import Test2_area from './Test2_area'

const Test2 = () => {
    const [dataAry1, setDataAry1] = useState([]);

    const data_1 = "apple";
    const data_2 = "orange";
    const newData1 = [...dataAry1, data_1, data_2];

    // if関数が必要
    // これがないと、Renderingが多すぎる（Too Many re-renders…）という入門者が陥るエラーがおこる。
    // if関数がないと、また最初に戻ってuseStateに更新を行う。無限ループとなる。
    // "dataAry1.length < 3" "3"を変更すると分かりやすい
    if (dataAry1.length < 3) {
        setDataAry1(newData1);
    }

    return (
        <div>
            {dataAry1.map((bob, index) => (
                <Test2_area
                    a={bob}
                />
            ))}
        </div>
    )
}

export default Test2
