function createPopup(channelName) {
    const popup = document.createElement('div');
    popup.id = 'yt-channel-popup';
    popup.innerHTML = `
      <p>Current Channel:</p>
      <p>${channelName}</p>
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => {
      popup.style.opacity = '0';
      setTimeout(() => popup.remove(), 500);
    }, 3000);
  }
  
  function getChannelName() {
    const channelElement = document.querySelector('#top-row .ytd-channel-name a');
    return channelElement ? channelElement.textContent.trim() : "Channel name not found";
  }
  
  function checkForVideoPage() {
    if (window.location.pathname === '/watch') {
      const channelName = getChannelName();
      createPopup(channelName);
    }
  }
  
  // Check when the page loads
  checkForVideoPage();
  
  // Listen for navigation events (for single-page app navigation)
  let lastUrl = location.href; 
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      checkForVideoPage();
    }
  }).observe(document, {subtree: true, childList: true});