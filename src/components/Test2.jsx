import React, { useState } from 'react'
import Test2_area from './Test2_area'

const Test2 = () => {
    const dataAry1 = [];
    const data_1 = "apple";
    const data_2 = "orange";
    const newData1 = [...dataAry1, data_1, data_2];

    const [dataAry2, setDataAry2] = useState([]);
    const newData2 = [...dataAry2, data_1, data_2];
    setDataAry2(newData2);

    // setData([...data, data1, data2]);
    // setData((currentList) => [...currentList, data1])
    // setData((currentList) => [...currentList, data2])


    return (
        <div>

            {newData1.map((bob, index) => (
                <Test2_area
                    a={bob}
                />
            ))}

        </div>
    )
}

export default Test2
