let popupShown = false;
const targetChannels = ["Youtube Channel 1", "Youtube Channel 2"]; // More channels can be added here

function pauseVideo() {
  const video = document.querySelector('video');
  if (video) {
    video.pause();
  }
}

function createPopup(channelName) {
  if (popupShown) return;
  popupShown = true;

  pauseVideo();

  const existingOverlay = document.getElementById('yt-channel-popup-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  const overlay = document.createElement('div');
  overlay.id = 'yt-channel-popup-overlay';
  
  const popup = document.createElement('div');
  popup.id = 'yt-channel-popup';
  popup.innerHTML = `
    <p>Current Channel: ${channelName}</p>
    <p>This channel has been allegedly flagged for misinformation..</p>
    <div id="yt-channel-popup-buttons">
      <button id="yt-channel-popup-continue">Continue Watching</button>
      <button id="yt-channel-popup-stop">Stop Watching</button>
    </div>
  `;
  
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  document.getElementById('yt-channel-popup-continue').addEventListener('click', () => {
    const video = document.querySelector('video');
    if (video) {
      video.play();
    }
    overlay.remove();
    popupShown = false;
  });

  document.getElementById('yt-channel-popup-stop').addEventListener('click', () => {
    overlay.remove();
    popupShown = false;
  });
}

function getChannelName() {
  const channelElement = document.querySelector('#top-row .ytd-channel-name a');
  return channelElement ? channelElement.textContent.trim() : "Channel name not found";
}

function checkAndUpdateChannelName() {
  if (window.location.pathname === '/watch' && !popupShown) {
    const channelName = getChannelName();
    if (targetChannels.includes(channelName)) {
      createPopup(channelName);
    } else {
      // If it's not David Ondrej's channel, unpause the video
      const video = document.querySelector('video');
      if (video) {
        video.play();
      }
    }
  }
}

// Initial check
checkAndUpdateChannelName();

// Listen for navigation events
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    popupShown = false;
    setTimeout(() => {
      pauseVideo();
      checkAndUpdateChannelName();
    }, 500);
  }
}).observe(document, {subtree: true, childList: true});

// Additional observer for changes in the video player area
const videoPlayerObserver = new MutationObserver((mutations) => {
  if (!popupShown) {
    pauseVideo();
    checkAndUpdateChannelName();
  }
});

function observeVideoPlayer() {
  const videoPlayer = document.querySelector('#top-row');
  if (videoPlayer) {
    videoPlayerObserver.observe(videoPlayer, { childList: true, subtree: true });
  } else {
    setTimeout(observeVideoPlayer, 1000);
  }
}

observeVideoPlayer();

// Ensure video is paused when it's loaded
document.addEventListener('yt-navigate-finish', function() {
  pauseVideo();
  checkAndUpdateChannelName();
});