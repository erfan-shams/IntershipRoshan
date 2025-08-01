
import { useEffect, useState } from "react"
import './UploadBox.css'
import uploadAudio from "./uploadAudio"
import AccordionContent from "../Accordion_Content"

export default function UploadBox() {
    const [resultPage,setResultpage] = useState(false)
    const [selectedTab, setSelectedTab] = useState(1)
    const [text, setText] = useState("")
    const [duration, setDuration] = useState("")
    const [media_url, setMedia_url] = useState("")
    const [segments, setSegments] = useState([])

    useEffect(() => {
         uploadAudio(setResultpage,setText,setDuration,setMedia_url,setSegments)
    },[])
    return (
        <div>
            <div style={{ top: "35%", position: "absolute", left: "25%",display:resultPage? 'none':'block' }}>
                <div style={{ marginLeft: "40%" }}>
                    <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle id="uploadButton" cx="31" cy="31" r="31" fill="#118AD3" />
                        <path d="M36.7187 35.6195L31.2801 30.1809L25.8415 35.6195" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M31.2797 30.1809V42.4177" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M42.6869 38.8689C44.0131 38.146 45.0607 37.002 45.6644 35.6175C46.2681 34.233 46.3936 32.6869 46.0211 31.2232C45.6485 29.7595 44.7991 28.4615 43.607 27.5341C42.4148 26.6068 40.9478 26.1028 39.4374 26.1018H37.7242C37.3127 24.51 36.5456 23.0322 35.4807 21.7795C34.4158 20.5268 33.0808 19.5318 31.576 18.8693C30.0712 18.2068 28.4359 17.8941 26.7928 17.9546C25.1498 18.0152 23.5418 18.4474 22.0899 19.2188C20.6379 19.9902 19.3797 21.0808 18.4099 22.4084C17.4401 23.7361 16.7838 25.2664 16.4906 26.8842C16.1973 28.5019 16.2745 30.1652 16.7166 31.7488C17.1586 33.3324 17.9539 34.7952 19.0426 36.0273" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M36.7187 35.6195L31.2801 30.1809L25.8415 35.6195" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>


                </div>
                <div style={{ fontFamily: "IRANYekan", fontStyle: "normal", color: "#626262", marginTop: "5px" }}>
                    برای بارگذاری فایل گفتاری (صوتی/تصویری)، دکمه را فشار دهید <br />
                    متن پیاده شده آن، در اینجا ظاهر می شود

                </div>
                <input id="mediaInput" type="file" accept="audio/*" style={{display:'none'}}/>
            </div>
                    
            <div style={{display:resultPage ? 'block':'none'}}>
               <AccordionContent type={'upload'} id={'up_audioPlayback'} text={text} segments={segments} src_audio={media_url} setIsAfterReq={setResultpage} />
                              
            </div>
        </div>
    )
}











