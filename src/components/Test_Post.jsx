import React from "react";
import { deleteData } from "./Test_DeleteFunc"

const Test_Post = ({ text, image, id}) => {

  return (
    <>
      <div>
        <p>{text}</p>

        <button onClick={() => deleteData(id,image)}>削除</button>

        <img src={image} alt="" className="post_image" height="120px" />

      </div>
    </>
  );
};

export default Test_Post;