/* ---------------------------------------- Get Our Elements ---------------------------------------- */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('.fullscreen');

/* ---------------------------------------- Build Out Functions ---------------------------------------- */
function togglePlay() {
    if(video.paused) video.play();
    else video.pause();
}

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

function skip() {
    //console.log(this.dataset['skip']);
    video.currentTime += parseFloat(this.dataset['skip']);
}

function handleRangeUpdate() {
    console.log(this.value);
    video[this.name] = this.value;
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

/** @param {MouseEvent} e */ 
function scrub(e) {
    //Move video based on progress bar
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

function toggleFullscreen() {
    video.requestFullscreen();
}

/* ---------------------------------------- Event Listeners ---------------------------------------- */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
/*
//Same as line below
progress.addEventListener('mousemove', (e) => if(mousedown) scrub(e));
*/
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

fullscreen.addEventListener('click', toggleFullscreen);

/*
Where to get the fullscreen icon:   https://www.fileformat.info/info/unicode/char/26f6/index.htm
*/