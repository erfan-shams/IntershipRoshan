import { useEffect, useState } from 'react'
import './link_input.css'
import sendToTranscriptionProxy from '../transcribe'
import { produceText, prduceSegments } from '../transcribe'
import AccordionContent from '../Accordion_Content'

function Link_Input() {
    const [isAfterReq, setIsAfterReq] = useState(false)
    const [text, setText] = useState("")
    const [media_url, setMedia_url] = useState("")
    const [segments, setSegments] = useState([])

    useEffect(() => {
        // const exampleMediaUrl = "https://as-v2.tamasha.com/statics/videos_file/e4/e4/LkeZz_e4e4d57330cd197fa99889b1de3ec15fc8fa7af9_n_360.mp4";

        const link_input = document.getElementById("link_input")
        document.getElementById("submit_btn").addEventListener("click", () => {
            
            const url = link_input.value
            sendToTranscriptionProxy(url)
                .then(result => {
                    setText(produceText(result))
                    
                    setMedia_url(result['media_url'])
                    setSegments(prduceSegments(result))
                    setIsAfterReq(true)


                })
                .catch(error => {
                    console.error("Failed to get transcription:", error);

                });
        })

    }, [])

    return (
        <div>
            <div style={{ display: isAfterReq ? 'none' : 'block' }}>

                <div style={{
                    padding: '10px', border: "1px solid #FF1654", width: "43%", top: "35%", left: "30%",
                    position: "absolute", borderRadius: "50px", display: "flex", flexDirection: "row"
                }}>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="15" fill="#FF1654" id='submit_btn' />
                        <path d="M14.9103 10.4067L16.6317 8.68534C17.7202 7.72339 19.3403 7.82465 20.3023 8.88786C21.1883 9.84981 21.1883 11.3434 20.3023 12.3306L18.5556 14.052L19.0872 14.5836L20.8339 12.8369C22.1249 11.5459 22.0743 9.41946 20.7579 8.12843C19.4669 6.88802 17.4164 6.88802 16.1254 8.12843L14.3787 9.84981C13.0876 11.1662 13.0876 13.2673 14.3787 14.5836L14.9103 14.052C13.923 13.0394 13.923 11.4193 14.9103 10.4067Z" fill="white" />
                        <path d="M14.6065 21.95L16.3532 20.2286C17.6442 18.9123 17.6442 16.8112 16.3532 15.5201L15.8216 16.0517C16.8342 17.0643 16.8342 18.6844 15.8216 19.697L14.0749 21.4184C13.0623 22.431 11.4422 22.431 10.4296 21.4184C9.41703 20.4058 9.41703 18.7857 10.4296 17.7731L12.1763 16.0517L11.6447 15.5201L9.92332 17.2415C8.58165 18.5072 8.50571 20.6083 9.77143 21.95C11.0372 23.2917 13.1383 23.3676 14.4799 22.1019C14.5306 22.026 14.5812 22.0006 14.6065 21.95Z" fill="white" />
                        <path d="M17.7568 13.2324L17.2198 12.6954L13.0313 16.884L13.5683 17.421L17.7568 13.2324Z" fill="white" />
                    </svg>

                    <input type='text' className='link_input' id='link_input' style={{ border: "none", marginLeft: "5px" }}></input>
                </div>

                <div style={{ position: "absolute", top: "50%", left: "30%", fontFamily: "IRANYekan", color: "#626262", fontStyle: "normal" }}>
                    نشانی اینترنتی فایل حاوی گفتار (صوتی/تصویری) را وارد<br />
                    و دکمه را فشار دهید

                </div>
            </div>

            <div style={{ display: isAfterReq ? 'block' : 'none' }}>
                   <AccordionContent type={'link'} id={'up_audioPlayback'} text={text} segments={segments} src_audio={media_url} setIsAfterReq={setIsAfterReq} />
                                  
                
            </div>
        </div>
    )
}
export default Link_Input


