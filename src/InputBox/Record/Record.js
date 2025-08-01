import { useEffect, useState } from "react"
import './Record.css'

import { recordAudio } from "./recordAudio"
import sendToTranscriptionProxy from "../transcribe"
import { prduceSegments,produceText } from "../transcribe"
import AccordionContent from "../Accordion_Content"

export function Record() {
    const [recorded, setRecorded] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [selectedTab, setSelectedTab] = useState(1)
    const [text, setText] = useState("")
    const [duration, setDuration] = useState("")
    const [media_url, setMedia_url] = useState("")
    const [segments, setSegments] = useState([])

    useEffect(() => {
        document.getElementById("recordButton").addEventListener("click", () => {
            setIsRecording(true)
        })
        recordAudio(setIsRecording, setRecorded)
        document.getElementById("stopButton").onclick = () => {

            const url = "https://as-v2.tamasha.com/statics/videos_file/e4/e4/LkeZz_e4e4d57330cd197fa99889b1de3ec15fc8fa7af9_n_360.mp4"
            sendToTranscriptionProxy(url)
                .then(result => {
                    setText(produceText(result))
                    setDuration(result['duration'])
                    setMedia_url(result['media_url'])
                    setSegments(prduceSegments(result))
                    setRecorded(true)
                    setIsRecording(false)
                    
                })
                .catch(error => {
                    console.error("Failed to get transcription:", error);

                });
        }

    }, [])

    useEffect(() => {
        console.log(segments)
    },[segments])
    return (
        <div>
            <div style={{ display: recorded ? 'none' : 'block',top: "35%", position: "absolute", left: "32%" }}>
                <div style={{ marginLeft: "40%" }}>

                    <svg style={{ display: isRecording ? "none" : 'block' }} id='recordButton' width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="31" cy="31" r="31" fill="#00B3A1" />
                        <path d="M31 14.6389L30.2075 14.6868L29.431 14.8338L28.6801 15.0639L27.9579 15.3899L27.2804 15.7989L26.6573 16.2846L26.0981 16.8438L25.6124 17.467L25.2065 18.1412L24.8774 18.8634L24.6473 19.6176L24.5003 20.3941L24.4524 21.1866V32.6361L24.5003 33.4254L24.6473 34.1988L24.8774 34.9561L25.2065 35.6783L25.6124 36.3525L26.0981 36.9757L26.6573 37.5349L27.2804 38.0206L27.9579 38.4296L28.6801 38.7556L29.431 38.9889L30.2075 39.1295L31 39.1806L31.7861 39.1295L32.5658 38.9889L33.32 38.7556L34.039 38.4296L34.7196 38.0206L35.3364 37.5349L35.8956 36.9757L36.3877 36.3525L36.7935 35.6783L37.1163 34.9561L37.3527 34.1988L37.4965 33.4254L37.5413 32.6361V21.1866L37.4965 20.3941L37.3527 19.6176L37.1163 18.8634L36.7935 18.1412L36.3877 17.467L35.8956 16.8438L35.3364 16.2846L34.7196 15.7989L34.039 15.3899L33.32 15.0639L32.5658 14.8338L31.7861 14.6868L31 14.6389ZM30.6645 16.291H31.3356L31.997 16.3805L32.6425 16.5594L33.2561 16.8279L33.8281 17.1762L34.349 17.5948L34.8059 18.0869L35.1926 18.6333L35.4993 19.2309L35.723 19.8604L35.8604 20.5155L35.9084 21.1866V32.6361L35.8604 33.3072L35.723 33.9591L35.4993 34.5918L35.1926 35.183L34.8059 35.7358L34.349 36.2247L33.8281 36.6465L33.2561 36.9948L32.6425 37.2601L31.997 37.4422L31.3356 37.5317H30.6645L29.9998 37.4422L29.3543 37.2601L28.7376 36.9948L28.1656 36.6465L27.6479 36.2247L27.191 35.7358L26.8043 35.183L26.4943 34.5918L26.2707 33.9591L26.1396 33.3072L26.0917 32.6361V21.1866L26.1396 20.5155L26.2707 19.8604L26.4943 19.2309L26.8043 18.6333L27.191 18.0869L27.6479 17.5948L28.1656 17.1762L28.7376 16.8279L29.3543 16.5594L29.9998 16.3805L30.6645 16.291ZM21.1802 32.6361L21.2249 33.5469L21.3495 34.448L21.5604 35.3396L21.8512 36.2024L22.2219 37.0364L22.6693 37.8321L23.1902 38.5798L23.7749 39.2796L24.4236 39.9251L25.1267 40.5003L25.884 41.0116L26.6829 41.4526L27.5169 41.8169L28.3861 42.0949L29.2776 42.2994L30.1788 42.4177V45.725H24.4524V47.3611H37.5413V45.725H31.8181V42.4177L32.7192 42.2994L33.6108 42.0949L34.4768 41.8169L35.3172 41.4526L36.1161 41.0116L36.8734 40.5003L37.5764 39.9251L38.2219 39.2796L38.8099 38.5798L39.3276 37.8321L39.775 37.0364L40.1424 36.2024L40.4364 35.3396L40.6473 34.448L40.7752 33.5469L40.8135 32.6361H39.1806L39.1327 33.4893L38.9984 34.3362L38.7812 35.1638L38.4712 35.9627L38.0845 36.7264L37.6148 37.4454L37.0779 38.1069L36.4708 38.714L35.8061 39.2541L35.0871 39.7174L34.3266 40.1105L33.5277 40.4141L32.6969 40.6377L31.8564 40.772L31 40.8135L30.1436 40.772L29.2968 40.6377L28.4724 40.4141L27.6735 40.1105L26.9066 39.7174L26.1908 39.2541L25.5229 38.714L24.9157 38.1069L24.3789 37.4454L23.9155 36.7264L23.5257 35.9627L23.2189 35.1638L22.9952 34.3362L22.861 33.4893L22.8195 32.6361H21.1802Z" fill="white" />
                    </svg>
                    <button style={{ display: isRecording ? "block" : 'none' }} id="stopButton" class="icon-button stop" >
                        <i class="fas fa-stop" ></i>
                        <span>Stop</span>
                    </button>
                </div>
                <div style={{ fontFamily: "IRANYekan", fontStyle: "normal", color: "#626262", display: isRecording ? "none" : 'block' }}>
                    برای شروع به صحبت، دکمه را فشار دهید<br />
                    متن پیاده شده آن، در اینجا ظاهر شود
                </div>
                <div style={{ marginTop: "12px", fontFamily: "IRANYekan", fontStyle: "normal", color: "#626262", display: isRecording ? "block" : 'none' }}>
                    برای پایان ضبط دکمه را فشار دهید
                </div>

            </div>


            <div style={{ display: recorded ? 'block' : 'none' }}>
                
                <AccordionContent type={'record'} id={'rc_audioPlayback'} text={text} segments={segments} src_audio={media_url} setIsAfterReq={setRecorded} />
               
               
            </div>

        </div>
    )
}


