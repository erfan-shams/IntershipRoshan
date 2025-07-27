import { eventWrapper } from "@testing-library/user-event/dist/utils";
import { handleRequest } from "./fetchRequests";
export function archiveClickHandler({requests,setRequests}) {


    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function () {
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.closest('.accordion-item').classList.remove('active');

                    let allMedia = document.querySelectorAll('audio')
                    allMedia.forEach(media => {
                        if (!media.paused) {
                            media.pause()
                        }
                    })
                }
            });
            console.log(header.closest('.accordion-item').classList.contains('active'))
            header.closest('.accordion-item').classList.toggle('active');
            document.getElementById('pagination').style.top = '80%'
            document.querySelectorAll('.accordion-item').forEach(item => {
                if (item.closest('.accordion-item').classList.contains('active') === true) {
                    document.getElementById('pagination').style.top = '89%'
                }

            })

        });
    });




    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabsContainer = this.closest('.tabs-container');
            const targetTabId = this.dataset.tab;


            tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });


            tabsContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
                let allMedia = content.querySelectorAll('audio')
                allMedia.forEach(media => {
                    if (!media.paused) {
                        media.pause()
                    }
                })
            });


            this.classList.add('active');


            tabsContainer.querySelector(`#${targetTabId}`).classList.add('active');
        });
    });

    document.querySelectorAll('.downloadIcon').forEach(dwIcon => {
        dwIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            let text = dwIcon.getAttribute('data-text')
            let filename = dwIcon.getAttribute('data-filename')
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })
    })

    document.querySelectorAll('.copyIcon').forEach(cpIcon => {
        cpIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            let text = cpIcon.getAttribute('data-text')
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = text;
            tempTextArea.style.position = 'absolute';
            tempTextArea.style.left = '-9999px';
            document.body.appendChild(tempTextArea);

            tempTextArea.select();
            tempTextArea.setSelectionRange(0, 99999);
            const successful = document.execCommand('copy');
            document.body.removeChild(tempTextArea);
        })
    })
    document.querySelectorAll('.delIcon').forEach(delIcon => {
        delIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            let id = delIcon.getAttribute('data-id')
            handleRequest({ method: 'del', id: id })
             let updated_requests = requests.filter(archiveItem => archiveItem.id != id);
             
             setRequests(updated_requests)

            
        })
    })


}