import {Component} from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.timer = 0;
    this.seconds = 1500;
    this.break = 300;
    this.state = {
      break : 5,
      time : 25,
      mm : 25, 
      ss : 0,
      start : false,
      current : true,
    }

    this.secondsToTime = this.secondsToTime.bind(this);
    this.breakChange = this.breakChange.bind(this);
    this.timeChange = this.timeChange.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.reset = this.reset.bind(this);
    this.calculateTime = this.calculateTime.bind(this);
    this.playSound = this.playSound.bind(this)
  }
  setStyle = (sec) => {
    const element = document.getElementById('time-left');
    element.setAttribute('style', `background: conic-gradient(#fec3 calc(${
      (sec/((this.state.current === true ? this.state.time : this.state.break)*60))*100
    }*1%), #0000 0)`)
  }
  playSound = () => {
    const soundPromise = () => document.getElementById('beep').play()
    if (soundPromise() !== undefined){
      soundPromise().then((result) => {console.log(result)}).catch(()=>{console.log('error happened')})
    } 

    const playDivision = document.getElementById('audiobutton')
    playDivision.addEventListener('click', soundPromise) 
    playDivision.click()
  }
  secondsToTime = secs => {
    let minutes = Math.floor(secs / 60)
    let divisorForSeconds = secs % 60
    let seconds = Math.ceil(divisorForSeconds)

    return {mm : minutes, ss : seconds}
  }
  breakChange = value => {
    if ((this.break > 60 || value !== 'dec') && (this.break < 3600 || value !== '')) {
      this.break = value === 'dec' ? this.break-60 : this.break+60
      let br = this.break/60
      this.setState({
        break : br
      })
    }
  }
  timeChange = value => {
    if ((this.seconds > 60 || value !== 'dec') && (this.seconds < 3600 || value !== '')){
      this.seconds = value === 'dec' ? this.seconds-60 : this.seconds+60
      let tm = this.seconds/60
      this.setState({time : tm})
      if (this.state.current === true){
        this.calculateTime(this.seconds)
      }
    }
  }
  calculateTime = seconds => {
    let timeLeftVar = this.secondsToTime(seconds)
    this.setState({mm : timeLeftVar.mm, ss : timeLeftVar.ss})
  }
  startTimer = () => {
    if (this.state.start === false){
      this.setState({start: true});
      if(this.state.current === true ? this.seconds : this.break > 0){
        this.countDown()
        this.timer = setInterval(this.countDown , 10)
      }
    } else {
      clearInterval(this.timer)
      this.setState({start : false});
    }
  }
  countDown = () => {
    let sec = this.state.current === true ?
      this.seconds--
    :  this.break--
    this.setStyle(sec)
    this.calculateTime(sec);
    if (sec === 0){
      this.setState({current : this.state.current === true ? false : true,
        start : false
      })
      this.playSound()
      clearInterval(this.timer)
      this.break = this.state.break*60
      this.seconds = this.state.time*60
      setTimeout(()=>this.startTimer(), 1000) 
    }
    
  }
  reset = () => {
    document.getElementById('beep').pause()
    this.seconds = 1500
    this.break = 300
    this.setState({
      break : this.break/60,
      time : this.seconds/60,
      start : false,
      current : true
    })
    this.calculateTime(this.seconds)
    this.setStyle(this.seconds)
    clearInterval(this.timer)
  }
  render() {
    return (
    <div className='app'>
    <div className='display'>
    <div id='timer-label'>{this.state.current=== true ? 'Session' : 'Break'}</div>
    <div className='time'>
    <div id='time-left'>
    <p>
    {this.state.mm < 10 ? `0${this.state.mm}` : this.state.mm}:
    {this.state.ss < 10 ? `0${this.state.ss}` : this.state.ss}
    </p>
    </div>
    </div>
    </div>
    <div className='break'>
    <div id='break-label'>break length</div>
    <div className='break-number'>
    <button className='decrement' id='break-decrement' onClick={()=>this.breakChange('dec')}>-</button>
    <div id='break-length'>{this.state.break}</div>
    <button className='increment' id='break-increment' onClick={()=>this.breakChange('')}>+</button>
    </div>
    </div>
    <div className='session'>
    <div id='session-label'>session length</div>
    <div className='session-number'>
    <button className='decrement' id='session-decrement' onClick={()=>this.timeChange('dec')}>-</button>
    <div id='session-length'>{this.state.time}</div>
    <button className='increment' id='session-increment' onClick={()=>this.timeChange('')}>+</button>
    </div> 
    </div>
    <button id='start_stop' onClick={
      ()=>this.startTimer()}>{this.state.start === false ? 'start' : 'stop'}</button>
    <button id='reset' onClick={()=>this.reset()}>Reset</button>
    <Audio />
    </div>
    )
  }
}

const Audio = () => {
  const beep = 'mixkit.wav'
  return <div id='audiobutton'>
  <audio id='beep' src={beep} type='audio/wav'/>
  </div> 
}

export default App;
