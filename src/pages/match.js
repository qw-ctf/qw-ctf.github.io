import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import FteComponent from "../components/fte"
import { window, document } from 'browser-monads';


function iOS() {

  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(window.navigator.platform) ||
    // iPad on iOS 13 detection
    (window.navigator.userAgent.includes("Mac") && "ontouchend" in document)
  )
}

const MatchPage = ({ pageContext: { demo, map, directory, duration } }) => {
  return (
    <Layout>
      <Seo title="demo" />
      {iOS() ? "iOS browser performance is really bad, please fix, or use Desktop or Android" : <FteComponent demo={demo} map={map.name} directory={directory} duration={duration}/>}
      <h1>{map.name.toUpperCase()}: {map.metadata.name} by {map.metadata.author || "Unknown"}</h1>
    </Layout>
  )
}

export default MatchPage
