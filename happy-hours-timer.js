/**
 * Happy Hours Timer
 * Displays a countdown timer for Happy Hours promotion (3PM-5PM)
 */

// Add CSS styles to the document head
function addTimerStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Happy Hours Timer Styles */
      .happy-hours-timer {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background-color: #feca57;
        color: #333;
        padding: 10px 15px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        z-index: 9998;
        font-size: 14px;
        font-weight: bold;
        font-family: Arial, sans-serif;
        transition: background-color 0.3s ease;
        display: none; /* Initially hidden */
      }
  
      .happy-hours-timer.active {
        background-color: #2ecc71;
      }
  
      .happy-hours-timer.inactive {
        background-color: #95a5a6;
      }
  
      .timer-title {
        margin-bottom: 5px;
      }
  
      .timer-content {
        display: flex;
        align-items: center;
        gap: 5px;
      }
  
      #timer-countdown {
        font-family: 'Courier New', monospace;
        letter-spacing: 1px;
      }
  
      .timer-close-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #333;
        padding: 0;
        line-height: 1;
        opacity: 0.7;
      }
  
      .timer-close-btn:hover {
        opacity: 1;
      }
  
      /* Animation for when happy hour is active */
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
  
      .happy-hours-timer.active {
        animation: pulse 2s infinite;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize timer on page load
  document.addEventListener('DOMContentLoaded', function() {
      addTimerStyles();
      initializeHappyHoursTimer();
  });
  
  /**
   * Initialize the Happy Hours timer
   */
  function initializeHappyHoursTimer() {
      // Create timer container if it doesn't exist
      if (!document.getElementById('happy-hours-timer')) {
          createTimerElement();
      }
      
      // Update timer immediately and then every second
      updateHappyHoursTimer();
      setInterval(updateHappyHoursTimer, 1000);
  }
  
  /**
   * Create the timer element and add it to the page
   */
  function createTimerElement() {
      // Create timer container
      const timerContainer = document.createElement('div');
      timerContainer.id = 'happy-hours-timer';
      timerContainer.className = 'happy-hours-timer';
      
      // Add content to the timer
      timerContainer.innerHTML = `
          <div class="timer-title">Happy Hours</div>
          <div class="timer-content">
              <span id="timer-status">Starting in </span>
              <span id="timer-countdown">00:00:00</span>
          </div>
          <button class="timer-close-btn">×</button>
      `;
      
      // Add close button event listener
      timerContainer.querySelector('.timer-close-btn').addEventListener('click', function() {
          timerContainer.style.display = 'none';
      });
      
      // Add to document
      document.body.appendChild(timerContainer);
  }
  
  /**
   * Update the Happy Hours timer
   */
  function updateHappyHoursTimer() {
      const timerContainer = document.getElementById('happy-hours-timer');
      const timerStatus = document.getElementById('timer-status');
      const timerCountdown = document.getElementById('timer-countdown');
      
      if (!timerContainer || !timerStatus || !timerCountdown) return;
      
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const currentSecond = currentTime.getSeconds();
      
      let timeString;
      let statusText;
      let showTimer = true;
      
      // Define happy hours start and end
      const happyHoursStart = 15; // 3PM
      const happyHoursEnd = 17; // 5PM
      
      // Calculate time until or remaining in happy hours
      if (currentHour < happyHoursStart) {
          // Time until happy hours start
          let hoursUntil = happyHoursStart - currentHour - 1;
          let minutesUntil = 60 - currentMinute - 1;
          let secondsUntil = 60 - currentSecond;
          
          if (secondsUntil === 60) {
              secondsUntil = 0;
              minutesUntil++;
          }
          
          if (minutesUntil === 60) {
              minutesUntil = 0;
              hoursUntil++;
          }
          
          timeString = `${padZero(hoursUntil)}:${padZero(minutesUntil)}:${padZero(secondsUntil)}`;
          statusText = 'Starting in ';
          timerContainer.className = 'happy-hours-timer';
      } else if (currentHour >= happyHoursStart && currentHour < happyHoursEnd) {
          // Time remaining in happy hours
          let hoursRemaining = happyHoursEnd - currentHour - 1;
          let minutesRemaining = 60 - currentMinute - 1;
          let secondsRemaining = 60 - currentSecond;
          
          if (secondsRemaining === 60) {
              secondsRemaining = 0;
              minutesRemaining++;
          }
          
          if (minutesRemaining === 60) {
              minutesRemaining = 0;
              hoursRemaining++;
          }
          
          timeString = `${padZero(hoursRemaining)}:${padZero(minutesRemaining)}:${padZero(secondsRemaining)}`;
          statusText = 'Time remaining: ';
          timerContainer.className = 'happy-hours-timer active';
          
          // Apply happy hours discount if not already applied
          if (typeof specialOffersActive !== 'undefined' && !specialOffersActive.happyHours) {
              applyHappyHoursDiscount();
          }
      } else {
          // Happy hours are over for today
          let hoursUntil = 24 - currentHour + happyHoursStart - 1;
          let minutesUntil = 60 - currentMinute - 1;
          let secondsUntil = 60 - currentSecond;
          
          if (secondsUntil === 60) {
              secondsUntil = 0;
              minutesUntil++;
          }
          
          if (minutesUntil === 60) {
              minutesUntil = 0;
              hoursUntil++;
          }
          
          timeString = `${padZero(hoursUntil)}:${padZero(minutesUntil)}:${padZero(secondsUntil)}`;
          statusText = 'Next happy hour in ';
          timerContainer.className = 'happy-hours-timer inactive';
      }
      
      // Update timer display
      timerStatus.textContent = statusText;
      timerCountdown.textContent = timeString;
      
      // Show timer if it's around happy hours time (1 hour before, during, or 1 hour after)
      if ((currentHour >= happyHoursStart - 1 && currentHour < happyHoursEnd + 1)) {
          timerContainer.style.display = 'block';
      }
  }
  
  /**
   * Pad a number with leading zero if less than 10
   * @param {number} num - Number to pad
   * @return {string} - Padded number as string
   */
  function padZero(num) {
      return num < 10 ? '0' + num : num;
  }