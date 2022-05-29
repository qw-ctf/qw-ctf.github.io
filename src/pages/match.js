import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import FteComponent from "../components/fte"
import { window, document } from "browser-monads"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShare, faDownload } from "@fortawesome/free-solid-svg-icons"
import * as matchStyle from "./match.module.scss"

function iOS() {
  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(window.navigator.platform) ||
    // iPad on iOS 13 detection
    (window.navigator.userAgent.includes("Mac") && "ontouchend" in document)
  )
}

function parseName(name) {
  let result = ""
  for (var i = 0; i < name.length; i++) {
    const code = name.charCodeAt(i)
    if (code >= 128) {
      result += String.fromCharCode(code - 128)
    } else {
      result += name[i]
    }
  }
  return result
}

const MatchPage = ({ pageContext: { demo, map, directory, duration, stats } }) => {
  const baseUrl = "https://media.githubusercontent.com/media/qw-ctf/matches/main/"
  const demoUrl = `${baseUrl}${directory}/${encodeURIComponent(demo)}.gz`
  // TODO: Figure out why map can be null here
  if (map == undefined) return <div />

  return (
    <Layout>
      <Seo title="demo" />
      {iOS() ? (
        "iOS browser performance is really bad, please fix, or use Desktop or Android"
      ) : (
        <FteComponent demo={demo} map={map.name} directory={directory} duration={duration} />
      )}
      <div className={matchStyle.matchInfo}>
        <div className={matchStyle.mapName}>
          {map.name.toUpperCase()}: {map.metadata.name} by {map.metadata.author || "Unknown"}
        </div>
        <div className={matchStyle.share}>
          <FontAwesomeIcon icon={faShare} />
          Share
        </div>
        <div className={matchStyle.download}>
          <a href={demoUrl}>
            <FontAwesomeIcon icon={faDownload} />
            Download
          </a>
        </div>
      </div>
      <div className={matchStyle.tableWrap}>
        <table>
          <tr>
            <th className={matchStyle.nameColumn}>Name</th>
            <th>Points</th>
            <th>Kills</th>
            <th>Deaths</th>
            <th>Flag Caps</th>
            <th>Flag Pickups</th>
            <th>Flag Defends</th>
            <th>Flag Returns</th>
            <th>Carrier Defs</th>
            <th>Carrier Frags</th>
            <th>Resistance Rune</th>
            <th>Strength Rune</th>
            <th>Haste Rune</th>
            <th>Regeneration Rune</th>
          </tr>
          {stats.map(player => {
            return (
              <tr>
                <td className={matchStyle.nameColumn}>{parseName(player.name)}</td>
                <td>{player.stats.frags}</td>
                <td>{player.stats.kills}</td>
                <td>{player.stats.deaths}</td>
                <td>{player.ctf.caps || 0}</td>
                <td>{player.ctf.pickups || 0}</td>
                <td>{player.ctf.defends || 0}</td>
                <td>{player.ctf.returns || 0}</td>
                <td>{player.ctf.carrier_defends || 0}</td>
                <td>{player.ctf.carrier_frags || 0}</td>
                <td>{Math.floor((player.ctf.runes[0] * 100.0) / duration)}%</td>
                <td>{Math.floor((player.ctf.runes[1] * 100.0) / duration)}%</td>
                <td>{Math.floor((player.ctf.runes[2] * 100.0) / duration)}%</td>
                <td>{Math.floor((player.ctf.runes[3] * 100.0) / duration)}%</td>
              </tr>
            )
          })}
        </table>
      </div>
    </Layout>
  )
}

export default MatchPage
