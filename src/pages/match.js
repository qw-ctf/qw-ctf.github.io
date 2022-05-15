import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import FteComponent from "../components/fte"
import DiscordButton from "../components/discord"

function iOS() {
  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  )
}

const MatchPage = ({ pageContext: { demo, map } }) => {
  return (
    <Layout>
      <Seo title="demo" />
      {iOS() ? "iOS browser performance is really bad, please fix, or use Desktop or Android" : <FteComponent demo={demo} map={map} />}
      <DiscordButton />
    </Layout>
  )
}

export default MatchPage
