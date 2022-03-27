<script lang="ts">
  import {tweened} from 'svelte/motion'
  import dayjs, {Dayjs} from 'dayjs'
  import config from './config'

  export let timerMaxMinutes = config.timer?.minutes ?? 5

  interface TimerValue {
    elapsedTime: number
    mm: string
    ss: string
  }

  let baseTime: Dayjs
  let timerValue: TimerValue
  let triggeredAlerts: {[key: number]: boolean} = {}
  let domNotificationSound: HTMLAudioElement

  const progress = tweened(0, {duration: 1000})
  $: {
    const p = timerValue.elapsedTime / (60 * 1000 * timerMaxMinutes)
    $progress = (p < 1) ? p : 1
  }

  resetTimer()
  setInterval(() => {
    timerValue = getTimerValue()

    // 5 分以内ならタイマー更新のみ
    if ( timerValue.elapsedTime < timerMaxMinutes * 60 * 1000 ) { return }

    if ( triggeredAlerts[timerValue.mm] == null ) {
      domNotificationSound.play()
      triggeredAlerts[timerValue.mm] = true
    }
  }, 1000)

  function resetTimer() {
    baseTime   = dayjs() //.add(-60 * timerMaxMinutes + 5, 'seconds')
    timerValue = getTimerValue()
    triggeredAlerts = {}
  }

  function getTimerValue(): TimerValue {
    const to   = dayjs()
    const diff = to.diff(baseTime)

    return {
      mm: Math.floor(diff / 1000 / 60).toString().padStart(2, '0'),
      ss: (Math.floor(diff / 1000) % 60).toString().padStart(2, '0'),
      elapsedTime: diff,
    }
  }
</script>


<section id="timer" on:click={resetTimer}>
  <svg viewBox="0 0 10 10"
       style="background: hsl({120 * (1-$progress)}deg, 50%, {100 - 50 * $progress}%)"
       preserveAspectRatio="none">
    <rect width={10 * (1-$progress)}
          height=10
          fill="hsl({120 * (1-$progress)}deg, 50%, 50%)"
          />
  </svg>
  <div id="timer-text">{timerValue.mm}:{timerValue.ss}</div>
  <audio id="audio-player"
         src="{config.timer?.soundUrl}"
         bind:this={domNotificationSound}
         ></audio>
</section>


<style>
  :root {
    --timer-height: 3rem;
  }

  #timer {
    display:     flex;
    align-items: flex-end;
    height:      var(--timer-height);
    position:    relative;
    overflow:    hidden;
  }

  #timer > svg {
    position: absolute;
    left:     0;
    right:    0;
    width:    100%;
    height:   100%;
  }

  #timer > div#timer-text {
    display:         flex;
    mix-blend-mode:  difference;
    color:           #333;
    flex-direction:  column;
    align-items:     center;
    justify-content: center;
    line-height:     2rem;
    font-size:       2rem;
    height:          100%;
    width:           100%;
  }
</style>

