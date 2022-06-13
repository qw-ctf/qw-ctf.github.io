import * as React from "react"
import { Label, ReferenceDot, AreaChart, Area, XAxis, YAxis, linearGradient, ResponsiveContainer } from "recharts"
import Tippy from "@tippy.js/react"
import "tippy.js/dist/tippy.css"
import * as playerStyle from "./fte.module.scss"

const colorRed = "#960000"
const colorRedDark = "#670000"
const colorBlue = "#2f2f5f"
const colorBlueDark = "#1c1c4c"

function createEventText(event, player) {
  switch (event.type) {
    case "pent":
      return (
        <div>
          <span>{player.name} got the PENTAGRAM!</span>
          <br />
          <span>Total: {event.count}</span>
        </div>
      )
    case "quad":
      return (
        <div>
          <span>{player.name} got the QUAD!</span>
          <br />
          <span>Duration: {event.meta}%</span>
          <br />
          <span>Total: {event.count}</span>
        </div>
      )
    case "capture":
      const flagColor = player.team == "red" ? "BLUE" : "RED"
      const captureTime = Math.round((event.timestamp - event.meta + Number.EPSILON) * 100.0) / 100.0
      return (
        <div>
          <span>
            {player.name} captured the {flagColor} flag!
          </span>
          <br />
          <span>Took: {captureTime}s</span>
          <br />
          <span>Total: {event.count}</span>
        </div>
      )
    default:
      return <div />
  }
}

function shortEventName(type) {
  switch (type) {
    case "quad":
      return "Q"
    case "pent":
      return "P"
    case "capture":
      return "C"
    default:
      return "?"
  }
}

const EventLabel = props => {
  const lines = createEventText(props.event, props.player)
  const short = shortEventName(props.event.type)
  return (
    <Tippy zIndex={9999} appendTo={props.parent.current} content={lines}>
      <g>
        <text x={props.viewBox.x} y={props.viewBox.y} fill="#bbb" dy={12} dx={4}>
          {short}
        </text>
      </g>
    </Tippy>
  )
}

const FragChart = ({ frags, events, players, parent }) => {
  return (
    <ResponsiveContainer className={playerStyle.scoreChart} height={100}>
      <AreaChart data={frags} margin={{ top: 7, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colorRed} stopOpacity={1} />
            <stop offset="95%" stopColor={colorRed} stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colorBlue} stopOpacity={1} />
            <stop offset="95%" stopColor={colorBlue} stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <YAxis type="number" hide={true} domain={[0, 1.15]} />
        <XAxis type="number" hide={true} domain={["dataMin", "dataMax"]} dataKey="timestamp" />
        <Area
          legendType="none"
          type="monotone"
          isAnimationActive={false}
          dataKey="red"
          stroke={colorRedDark}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          legendType="none"
          type="monotone"
          isAnimationActive={false}
          dataKey="blue"
          stroke={colorBlueDark}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorPv)"
        />

        {events
          .filter(event => {
            const player = players[event.uid]
            if (!player) console.warn("No player for event: ", event)
            return player
          })
          .map(event => {
            // This ^^ filter skips mismatches. Some cases the player is not part of KTX
            // JSON stats, and some cases the name from mvdparser doesn't match so the uid
            // link is not established. The latter part should be fixed.
            const player = players[event.uid]
            return (
              <ReferenceDot
                className={playerStyle.scoreEventDot}
                key={`frag-event-${event.timestamp}`}
                r={8}
                x={event.timestamp}
                y={event.y + 0.1}
                ifOverflow={"extendDomain"}
                label={<Label event={event} player={player} parent={parent} content={EventLabel} />}
                fill={player.team == "red" ? colorRed : colorBlue}
                stroke="#000"
              />
            )
          })}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default FragChart
