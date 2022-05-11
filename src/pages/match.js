import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import FteComponent from "../components/fte"
import DiscordButton from "../components/discord"
import browser from "browser-detect"


const MatchPage = ({ pageContext: { demo, map } }) => {
  return (
    <Layout>
      <Seo title="demo" />
      <FteComponent demo={demo} map={map}/>
      <DiscordButton/>
    </Layout>
  )
}

export default MatchPage
