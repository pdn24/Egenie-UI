import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../../assets/css/Editor.css'

const Editor = () => {
    const [value, setValue] = useState(
        `<p>(Short Product Description)</p>
        <h3><b>Specifications</b></h3>
         <ul>
           <li><b>Material:</b></li>
           <li><b>Size:</b></li>
         </ul>
        <h3><b>Additional Details</b></h3>
        <ul>
           <li>Detail 1</li>
           <li>Detail 2</li>
         </ul>
         <h3><b>Delivery Time :</b> [Delivery time in days]</h3>
         <h3><b>Return Policy :</b> [Return window and url for detailed policy]</h3>
`);
    const toolbarOptions = {
        toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, 3] }],
            ["bold", "underline", "italic", { color: [] }],
            // [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
            ["link", "image", "video"],
            ["code-block"],
        ],
    };
    return (
        <div>
            <ReactQuill modules={toolbarOptions} theme="snow" value={value} onChange={setValue} />
        </div>
    );
}

export default Editor;
