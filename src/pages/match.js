import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import FteComponent from "../components/fte"

const MatchPage = ({ pageContext: { demo, map } }) => {
  return (
    <Layout>
      <Seo title="demo" />
      <FteComponent demo={demo} map={map}/>
    </Layout>
  )
}

export default MatchPage
