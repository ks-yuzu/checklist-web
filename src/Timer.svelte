<script lang="ts">
  import {onMount} from "svelte";
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

  // set default option
  if (config.timer.notification?.enabled == null) {
    Object.assign(config, {timer: {notification: {enabled: true}}})
  }
  if (config.timer.sound?.enabled == null) {
    Object.assign(config, {timer: {notification: {enabled: false}}})
  }

  onMount(() => {
    domNotificationSound.volume = config.timer?.sound?.volume ?? 0.1
  })

  if ( config.timer.notification.enabled ) {
    Notification.requestPermission()
  }
  resetTimer()
  setInterval(updateTimer, 1000)

  function resetTimer() {
    baseTime   = dayjs()
    timerValue = getTimerValue()
    triggeredAlerts = {}
  }

  function updateTimer() {
    timerValue = getTimerValue()

    // 設定時間以内なら経過時間の更新のみ
    if ( timerValue.elapsedTime < timerMaxMinutes * 60 * 1000 ) { return }

    // 分をまたぐまで再通知しない
    if ( triggeredAlerts[timerValue.mm] != null ) {
      return
    }

    if ( config.timer.sound.enabled ) {
      domNotificationSound.play()
    }
    if ( config.timer.notification.enabled ) {
      sendNotification(`${timerValue.mm} 分経過しました`)
    }
    triggeredAlerts[timerValue.mm] = true
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

  function sendNotification(message) {
    if (Notification?.permission !== "denied") {
      new Notification(message)
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
         src="{config.timer?.sound?.url}"
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

