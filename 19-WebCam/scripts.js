/** @type {HTMLVideoElement} */ 
const video = document.querySelector('.player');

/** @type {HTMLCanvasElement} */ 
const canvas = document.querySelector('.photo');

/** @type {CanvasRenderingContext2D} */ 
const ctx = canvas.getContext('2d');

/** @type {HTMLAudioElement} */ 
const snap = document.querySelector('.snap');

const strip = document.querySelector('.strip');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            //console.log(localMediaStream);

            //This is deprecated in Chrome
            //https://stackoverflow.com/questions/27120757/failed-to-execute-createobjecturl-on-url
            //video.src = window.URL.createObjectURL(localMediaStream); 

            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error(`Oops!`, err);
        });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        //pixels = rgbSplit(pixels);
        pixels = greenScreen(pixels);
        ctx.globalAlpha = 0.9;
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    //Play take photo sound
    snap.currentTime = 0;
    snap.play();

    //Take photo data from canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'picture');
    link.innerHTML = `<img src="${data}" alt="Picture"/>`;
    strip.insertBefore(link, strip.firstChild);

}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] += 100; // red
        pixels.data[i + 1] -= 50;  // green
        pixels.data[i + 2] *= 0.5; // blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // red
        pixels.data[i + 100] = pixels.data[i + 1]; // green
        pixels.data[i - 150] = pixels.data[i + 2]; // blue
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
            pixels.data[i + 3] = 0;
        }
    }

    return pixels;
}

console.log(video.constructor.name);
getVideo();
video.addEventListener('canplay', paintToCanvas);