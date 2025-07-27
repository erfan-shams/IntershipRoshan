import sendToTranscriptionProxy from "../transcribe"
import { prduceSegments, produceText } from "../transcribe"

export default function uploadAudio(setResultpag,setText,setDuration,setMedia_url,setSegments){
    const uploadButton = document.getElementById('uploadButton');
    const mediaInput = document.getElementById('mediaInput');
    uploadButton.addEventListener('click', () => {
        // Programmatically click the hidden file input
        mediaInput.click();
        
    });
    
    mediaInput.addEventListener('change', () => {
        
        if (mediaInput.files.length > 0) {
            const file = mediaInput.files[0]
            if (file.type.startsWith('audio/')) {

                const audio1 = document.getElementById("up_audioPlayback1");
                audio1.controls = true; // Add controls for playback
                audio1.src = URL.createObjectURL(file); 
                
                const audio2 = document.getElementById("up_audioPlayback2");
                audio2.controls = true; // Add controls for playback
                audio2.src = URL.createObjectURL(file); 

                setResultpag(true)
                mediaInput.value = ''
                const url = "https://as-v2.tamasha.com/statics/videos_file/e4/e4/LkeZz_e4e4d57330cd197fa99889b1de3ec15fc8fa7af9_n_360.mp4"
                            sendToTranscriptionProxy(url)
                                .then(result => {
                                    setText(produceText(result))
                                    setDuration(result['duration'])
                                    setMedia_url(result['media_url'])
                                    setSegments(prduceSegments(result))
                                    
                
                                })
                                .catch(error => {
                                    console.error("Failed to get transcription:", error);
                
                                });

            }
            
        }
        
    })
}