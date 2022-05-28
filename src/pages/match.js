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

const MatchPage = ({ pageContext: { demo, map, directory, duration } }) => {
  const baseUrl = "https://media.githubusercontent.com/media/qw-ctf/matches/main/"
  const demoUrl = `${baseUrl}${directory}/${encodeURIComponent(demo)}.gz`

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
    </Layout>
  )
}

export default MatchPage
