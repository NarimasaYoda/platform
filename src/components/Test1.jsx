import React from 'react'
import Test1_area from './Test1_area'

const Test1 = () => {

    let x = "おはようございます"
    let y = "コメント"

    return (
        <div>
            <Test1_area
            a={x}
            b={y}
            />
        </div>
    )
}

export default Test1
