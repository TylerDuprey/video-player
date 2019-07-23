// JavaScript Document

///////////////////////////
// Define Global Variables
///////////////////////////
const domVideo = document.getElementsByTagName('video')[0];
let currentTime = domVideo.currentTime;
const domCaptions = document.querySelectorAll('.caption');
const seeker = document.getElementById('rangeInput');
const playButton = document.getElementById('play');
const muteButton = document.getElementById('mute');
const volumeBar = document.getElementById('volume');
const fullScreenButton = document.getElementById('fullScreen');
let isPlaying = false;
const captionReference = [];
//////////////////////////////////
// Video Control Functions
//////////////////////////////////

// Toggle the video between play and pause state
function togglePlay() {
  if(isPlaying) {
    domVideo.pause();
    isPlaying = false;
    playButton.innerHTML = '<img src="video-plugin/video-img/play.png" />';
  } else {
    domVideo.play();
    isPlaying = true;
    playButton.innerHTML = '<img src="video-plugin/video-img/pause.png" />';
  }
}
// Change the time of the video
function updateTime(time) {
  domVideo.currentTime = time;
}
function rewind(sec) {
  let time = domVideo.currentTime;
  if(time > 10) {
    time = time - 10;
    domVideo.currentTime = time;
  } else {
    domVideo.currentTime = 0;
  }
}
// Fast forward video
function fastforward(sec) {
  let time = domVideo.currentTime;
  if(time < domVideo.duration - 10) {
    time = time + 10;
    domVideo.currentTime = time;
  } else {
    domVideo.currentTime = domVideo.duration;
    domVideo.pause();
    isPlaying = false;
  }
}
// Decrease video volume
function changeVol(vol) {
  if(vol > 1) {
    domVideo.volume = 1;
    volumeBar.value = 1;
    muteButton.innerHTML = '<img src="video-plugin/video-img/volume.png" />'
  } else if(vol <= 0) {
    domVideo.volume = 0;
    volumeBar.value = 0;
    muteButton.innerHTML = '<img src="video-plugin/video-img/mute.png" />';
  } else {
    domVideo.volume = vol;
    volumeBar.value = vol;
    muteButton.innerHTML = '<img src="video-plugin/video-img/volume.png" />'
  }
}
// Make full screen
function fullScreenify() {
  if (domVideo.requestFullscreen) {
    domVideo.requestFullscreen();
  } else if (domVideo.mozRequestFullScreen) {
    domVideo.mozRequestFullScreen(); // Firefox
  } else if (domVideo.webkitRequestFullscreen) {
    domVideo.webkitRequestFullscreen(); // Chrome and Safari
  }
}
////////////////////////////////////////////
// Update Seek Bar Background with Video
////////////////////////////////////////////
function trackSeeker(time) {
  time = time / 100 + .0025; // Add an extra bit so it doesn't fall behind as much
  seeker.style.backgroundImage = "-webkit-gradient(linear, left top, right top, "
                                 + "color-stop(" + time + ", #fff), "
                                 + "color-stop(" + time + ", rgba(255,255,255,.1)"
                                 + ")";
}

////////////////////////////////////////////
// Update Caption Highlight with Video
////////////////////////////////////////////
function highlightify(time) {
  for(let i=0;i<captionReference.length;i++) {
    domCaptions[i].classList.remove('highlight');
    if(captionReference[i].time < time && captionData[i+1] == null) {
        domCaptions[i].classList.add('highlight');
    } else if (captionReference[i].time < time && captionData[i+1].time > time) {
        domCaptions[i].classList.add('highlight');
    } else if (captionReference[i].time == time) {
        domCaptions[i].classList.add('highlight');
    }
  }
}
//Update video timer
function getTime(time) {
  let hrs = 0;
  let min = 0;
  let sec = 0;
  let html = '';
  time = Math.floor(time);
  // Get Hours
  hrs = Math.floor((time / 60) / 60);
  // Get Minutes
  min = time - (hrs * 3600);
  min = min / 60;
  min = Math.floor(min);
  // Get Seconds
  sec = time - (hrs*3600 + min*60);
  hrs = hrs.toString();
  if(min < 10) {
    min.toString();
    min = '0' + min;
  }
  if(sec < 10) {
    sec.toString();
    sec = '0' + sec;
  }
  if(hrs === '0') {
    return min + ":" + sec;
  } else {
    return hrs + ":" + min + ":" + sec;
  }
}

////////////////////////////////////////////
// Listen for User Interactions and respond
////////////////////////////////////////////

// track video progress and update range and captions
domVideo.addEventListener("timeupdate",function() {
  currentTime = domVideo.currentTime;
  // update caption highlight
  highlightify(currentTime);
  // update range input;
  seeker.value = (100 / domVideo.duration) * currentTime;
  trackSeeker(seeker.value);
  startTime.innerText = getTime(domVideo.currentTime);
});
// track video seek bar position when manually changed by user with touch
seeker.addEventListener("touchstart", function() {
  domVideo.pause(); // Need to Pause the video while user scrubs
});
seeker.addEventListener("touchend", function() {
  updateTime(domVideo.duration * (seeker.value / 100));
  if(isPlaying) {
    domVideo.play(); // Need to continue playing if it was playing before
  }
});
// track video seek bar position when manually changed by user with mouse
seeker.addEventListener("mousedown", function() {
  domVideo.pause(); // Need to Pause the video while user scrubs
});
seeker.addEventListener("mouseup", function() {
  updateTime(domVideo.duration * (seeker.value / 100));
  if(isPlaying) {
    domVideo.play(); // Need to continue playing if it was playing before
  }
});
// Change the volume when volume indicator is changed
volumeBar.addEventListener('change', function() {
  // Update the video volume
  changeVol(volumeBar.value);
});
// Jump to point in video when caption is clicked
for(let i=0;i<domCaptions.length;i++) {
  let clickableCaption = domCaptions[i];
  clickableCaption.addEventListener('click',function(e) {
    for(let i=0;i<captionReference.length;i++) {
      if(captionReference[i].text == e.target.innerText) {
          updateTime(captionReference[i].time);
      }
    }
  });
}
// Toggle video with video click
domVideo.addEventListener('click',function() {
      togglePlay();
});
// Change video element state with keyboard press
document.body.onkeyup = function(e){
    let time = domVideo.currentTime;
    let volume = domVideo.volume;
    // Spacebar press
    if(e.keyCode == 32){
      e.preventDefault();
      togglePlay();
    }
    // left press
    if(e.keyCode == 37){
      time = domVideo.currentTime - 10;
      updateTime(time);
    }
    // right press
    if(e.keyCode == 39){
      time = domVideo.currentTime + 10;
      updateTime(time);
    }
    // up press
    if(e.keyCode == 38){
      volume = domVideo.volume + .10;
      changeVol(volume);
    }
    // down press
    if(e.keyCode == 40){
      volume = domVideo.volume - .10;
      changeVol(volume);
    }
}
// Change video element state on keyboard down press
document.body.onkeydown = function(e) {
  // Spacebar press
  if(e.keyCode == 32){
    e.preventDefault();
  }
  // up press
  if(e.keyCode == 38){
    volume = domVideo.volume + .05;
    changeVol(volume);
  }
  // down press
  if(e.keyCode == 40){
    volume = domVideo.volume - .05;
    changeVol(volume);
  }
};
// Toggle video play state when play/pause buttons are pressed
playButton.addEventListener('click',function() {
  togglePlay();
});
// Toggle video muted state when mute/volume buttons are pressed
muteButton.addEventListener('click',function() {
  if(domVideo.volume > 0) {
    changeVol(-2);// Will take vol to zero no matter what it's at now
  } else {
    changeVol(.65);// Will default to 65% for user ear safety
  }
});
// Request full screen from browser when button clicked
fullScreenButton.addEventListener('click',function() {
  fullScreenify();
});
// Calls to video's data need to be called after video metadata loads
domVideo.onloadedmetadata = function() {
  endTime.innerText = getTime(domVideo.duration);
};
// Still not sure why it needs to be repeated. But was buggy without this line
endTime.innerText = getTime(domVideo.duration);
// Load the caption reference variable using data supplied
for(let i=0;i<captionData.length;i++) {
  captionReference.push(captionData[i]);
}
