import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
const [breakLength, setBreakLength] = useState(5);
const [sessionLength, setSessionLength] = useState(25);
const [play, setPlay] = useState(false);
const [timingType, setTimingType] = useState("SESSION");
const [timeLeft, setTimeLeft] = useState(1500)

useEffect(() => { //runs only when play or timeLeft changes
  //setInterval calls a function at regular intervals, every 1000ms in this case
  let timeoutId = setInterval(() => {
    // below runs if there is time left and the 'play' state is true, decreasing the 'timeLeft' state
    if(timeLeft > 0 && play){
      console.log("time left: " + timeLeft + " play: " + play)
      console.log("timeoutId: " + timeoutId)
      setTimeLeft(timeLeft - 1)
    } else { // if reaches 0 and play is true, or greater than 0 and play is false (when increase/decrease seesion used)
      console.log("ResetTimer function called")
      resetTimer()
    }
  }, 1000); 

  return () => {
    clearInterval(timeoutId)
  }

}, [play,timeLeft ])


const handleSessionAndBreak = (length, type, incDec) => {
  console.log("length: " + length + ", type: " + type + " Increase: " + incDec)
  let workingVal = 0;
  if(incDec){
    //code to increase
    if(length < 60){
      workingVal = length + 1;
      if(type ==="BREAK"){
        setBreakLength(workingVal)
      } else {
        setSessionLength(workingVal)
      }
    }
    //code to decrease
    } else if (length > 1){
      workingVal = length - 1;
      console.log("decVal: " + workingVal)
      if(type ==="BREAK"){
        setBreakLength(workingVal)
      } else {
        setSessionLength(workingVal)
      }         
    }
    if(length < 60 && length > 1 && timingType === type){
      setTimeLeft(workingVal * 60)
    }
  }



const handleBreakIncrease = () => {
  if(breakLength < 60){
    const newVal = breakLength + 1;
    setBreakLength(newVal)
    if(timingType === "BREAK"){
      setTimeLeft(newVal * 60)
    }
  }
}

const handleBreakDecrease = () => {
  if(breakLength > 1){
    const newVal = breakLength - 1;
    setBreakLength(newVal)
    if (timingType === "BREAK"){
      setTimeLeft(newVal * 60)
    }
  }
}

const handleSessionIncrease = () => {
  if(sessionLength < 60){
    const newVal = sessionLength + 1;
    setSessionLength(newVal)
    if (timingType === "SESSION"){
      setTimeLeft(newVal * 60)
    }
  }
}

const handleSessionDecrease = () => {
  if(sessionLength > 1){
    const newval = sessionLength - 1;
    setSessionLength(newval)
    if (timingType === "SESSION"){
      setTimeLeft(newval * 60 )
    }
  }
}

const timeFormatter = () => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft - minutes * 60;
  const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${formattedMinutes}:${formattedSeconds}`;
}



const handlePlay = () => {
  const currentPlayState = !play // Create new constant holding inverse (boolean) of play state
  setPlay(currentPlayState); // set play state to new constant (toggling it)
  if (currentPlayState) resetTimer() // if current Play state is true then call resetTimer() function
}

const resetTimer = () => {
  const audio = document.getElementById("beep"); // gets audio element with ID of beep
  if(!timeLeft && timingType ==="SESSION"){ // if timeLeft = 0 and timingType is "SESSION"
    setTimeLeft(breakLength * 60) // Set TimeLeft state to length of break * 60 (to get seconds)
    setTimingType("BREAK") // Set state of timingType to "BREAK"
    audio.play() //Play audio beep
  }
  if(!timeLeft && timingType ==="BREAK"){ // if timeLeft = 0 and timingType is "BREAK"
    setTimeLeft(sessionLength * 60) // Set TimeLeft state to length of session * 60 (to get seconds)
    setTimingType("SESSION") // Set state of timingType to "SESSION"
    audio.pause() //Pause currently playing Audio
    audio.currentTime = 0;// Sets current playback position in Audio to '0'
  }
}

const handleReset = () => {
  setPlay(false);
  setTimeLeft(1500);
  setBreakLength(5);
  setSessionLength(25);
  setTimingType("SESSION");
  const audio = document.getElementById("beep");
  audio.pause();
  audio.currentTime = 0;
}


  return (
    <div className="App">
      <div className='wrapper'>
        <h2>25 + 5 clock</h2>
        <div className='break-session-length'>
          <div>
            <h3 id="break-label">Break Length</h3>
            <div>
              <button disabled={play} onClick={() => handleSessionAndBreak(breakLength,"BREAK",true)} id="break-increment">Increase</button>
              <strong id="break-length">{breakLength}</strong>
              <button disabled={play} onClick={() => handleSessionAndBreak(breakLength,"BREAK",false)} id="break-decrement">Decrease</button>
            </div>
          </div>
          <div>
            <h3 id="session-label">Session Length</h3>
            <div>
              <button disabled={play} onClick={() => handleSessionAndBreak(sessionLength,"SESSION",true)} id="session-increment">Increase</button>
              <strong id="session-length">{sessionLength}</strong>
              <button disabled={play} onClick={() => handleSessionAndBreak(sessionLength,"SESSION",false)} id="session-decrement">Decrease</button>
            </div>
          </div>
        </div>

      </div>
      <div className='timer-wrapper'>
        <div className='timer'>
          <h2 id="timer-label">{timingType === "SESSION" ? "Session" : "Break"}</h2>
          <h3 id="time-left">{timeFormatter()}</h3>
        </div>
        <button onClick={handlePlay} id="start_stop">Start/Stop</button>
        <button onClick={handleReset} id="reset">Reset</button>
      </div>
      <audio id="beep" preload='auto' src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
      
    </div>
  );
}

export default App;
