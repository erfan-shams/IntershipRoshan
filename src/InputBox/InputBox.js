import './InputBox.css'
import Link_Input from './Link_Input/link_input'
import { Record } from './Record/Record'
import UploadBox from './Uploading/UploadBox'
function InputBox({ border_color, method }) {


    return (
        <div className="input_box" style={{ borderColor: border_color,borderTopRightRadius:method == 1? '0':'25px' }}>


            <div style={{ display: method == 1 ? "flex" : "none" ,flexDirection:"column"}}>
                <Record />
            </div>


            <div style={{ display: method === 3 ? 'flex' : 'none', flexDirection: "column" }}>
                <Link_Input />
            </div>



            <div style={{ display: method == 2 ? "block" : "none" }}>
                <UploadBox/>
            </div>


        </div>
    )
}

export default InputBox




