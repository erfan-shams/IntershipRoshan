export default function handler(){
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
}