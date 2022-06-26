import * as React from "react"
import * as shareMatchStyle from "./sharematch.module.scss"
import "tippy.js/dist/tippy.css"

function secondsToString(duration) {
  const durationMinutes = Math.floor(duration / 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })
  const durationSeconds = Math.floor(duration % 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })
  return `${durationMinutes}:${durationSeconds}`
}

const ShareMatch = ({ players, duration }) => {
  const [link, setLink] = React.useState("#")
  const [player, setPlayer] = React.useState(-1)
  const [gametime, setGametime] = React.useState(0)
  const [looptime, setLooptime] = React.useState(0)
  const [speed, setSpeed] = React.useState(100)

  React.useEffect(() => {
    const attrs = []
    console.log(typeof looptime)
    if (player != "-1") attrs.push(`player=${player}`)
    if (gametime != "0") attrs.push(`position=${gametime}`)
    if (looptime != "0") attrs.push(`loop=${looptime}`)
    if (speed != "100") attrs.push(`speed=${speed}`)
    setLink("#" + attrs.join("&"))
  }, [player, gametime, looptime, speed])

  return (
    <div className={shareMatchStyle.shareWrapper}>
      <div className={shareMatchStyle.title}>Player:</div>
      <div className={shareMatchStyle.playerSelect}>
        <select onChange={e => setPlayer(e.target.value)}>
          <option value="-1">auto</option>
          {Object.keys(players).map(key => {
            return <option value={key}>{players[key].name}</option>
          })}
        </select>
      </div>
      <div className={shareMatchStyle.title}>Timestamp:</div>
      <div>
        <input type="range" min="0" max={duration} step="1" value={gametime} onChange={e => setGametime(e.target.value)}></input>
      </div>
      <div className={shareMatchStyle.rightColumn}>
        <input type="text" value={secondsToString(gametime)}></input>
      </div>
      <div className={shareMatchStyle.title}>Playback speed:</div>
      <div>
        <input type="range" min="5" max="100" step="5" value={speed} onChange={e => setSpeed(e.target.value)}></input>
      </div>
      <div className={shareMatchStyle.rightColumn}>
        <input type="text" value={speed}></input>
      </div>
      <div className={shareMatchStyle.title}>Loop:</div>
      <div>
        <input type="range" min="0" max="30" step="1" value={looptime} onChange={e => setLooptime(e.target.value)}></input>
      </div>
      <div className={shareMatchStyle.rightColumn}>
        <input type="text" value={looptime}></input>
      </div>
      <div className={shareMatchStyle.generateLink}>
        <a href={link}>Copy link</a>
      </div>
    </div>
  )
}

export default ShareMatch
