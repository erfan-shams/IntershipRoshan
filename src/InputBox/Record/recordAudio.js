export function recordAudio(setIsRecording,setRecorded) {

    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const audioPlayback1 = document.getElementById('rc_audioPlayback1');
    const audioPlayback2 = document.getElementById('rc_audioPlayback2');
  
    let mediaRecorder;
    let audioChunks = [];
    let audioBlob; 

    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        
        recordButton.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = []; 

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); 
                    const audioUrl = URL.createObjectURL(audioBlob);

                    audioPlayback2.src = audioUrl;
                    audioPlayback2.controls = true; 

                    audioPlayback1.src = audioUrl;
                    audioPlayback1.controls = true;

                    stream.getTracks().forEach(track => track.stop()); 

                    setIsRecording(false)
                    setRecorded(true)
                };

                mediaRecorder.start();

                
                audioPlayback2.removeAttribute('src'); 
                audioPlayback1.removeAttribute('src');
               

            } catch (err) {

                console.error('Error accessing microphone:', err);
                
            }
        });

        stopButton.addEventListener('click', () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                
            }
        });

    } else {

        
    }

}