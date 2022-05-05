import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import * as matchStyle from "./matches.module.scss"

const Match = ({ slug, image, team, map }) => {
  return (
    <a key={slug} href={slug}>
      <div className={matchStyle.container}>
        <GatsbyImage className={matchStyle.mapContainer} imgClassName={matchStyle.mapImage} image={image} objectFit="scale" alt="" />
        <div className={matchStyle.infoContainer}>
          <div className={team.red.frags > team.blue.frags ? matchStyle.infoGridRed : matchStyle.infoGridBlue}>
            <div className={matchStyle.infoMap}>{map.toUpperCase()}</div>
            <div className={matchStyle.infoNumPlayers}>
              {team.red.players}on{team.blue.players}
            </div>
            <div className={matchStyle.infoTeamRed}>Red:</div>
            <div className={matchStyle.infoRedFrags}>{team.red.frags}</div>
            <div className={matchStyle.infoTeamBlue}>Blue:</div>
            <div className={matchStyle.infoBlueFrags}>{team.blue.frags}</div>
          </div>
        </div>
      </div>
    </a>
  )
}

const MatchesPage = () => {
  const data = useStaticQuery(graphql`
    query MyQuery {
      matches: allMatchesJson {
        group(field: fields___sort_date) {
          date: distinct(field: fields___date)
          edges {
            node {
              demo
              id
              map
              date
              fields {
                slug
                sort_date
                team {
                  red {
                    frags
                    players
                  }
                  blue {
                    frags
                    players
                  }
                }
              }
              duration
            }
          }
        }
      }

      maps: allFile(filter: { dir: { regex: "//maps//" } }) {
        edges {
          node {
            childImageSharp {
              gatsbyImageData(width: 500)
            }
            name
          }
        }
      }
    }
  `)

  const maps = {}
  console.log(data.maps);
  for (let i = 0; i < data.maps.edges.length; i++) {
    
    const mapName = data.maps.edges[i].node.name.split(".")[0]
    if (!maps[mapName]) maps[mapName] = []
    maps[mapName].push(data.maps.edges[i].node.childImageSharp)
  }

  const sorted = data.matches.group.sort((a, b) => {
    return new Date(b.date[0]) - new Date(a.date[0])
  })

  return (
    <Layout>
      <Seo title="QuakeWorld CTF Matches" />
      {window.devicePixelRatio}
      {sorted.map(group => {
        const date = new Date(Date.parse(group.date))
        return (
          <div>
            <span className={matchStyle.dateHeader}>
              {
                ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][
                  date.getMonth()
                ]
              }{" "}
              {date.getDate()}, {date.getFullYear()}
            </span>
            <br />
            <div className={matchStyle.matchListing}>
              {group.edges
                .sort((a, b) => a.node.fields.sort_date - b.node.fields.sort_date)
                .map(edge => {
                  const mapImages = maps[edge.node.map] || maps["e2m2"] // TODO: Add more screenshots
                  const index = new Date(edge.node.date).getMinutes() % mapImages.length

                  return Match({
                    slug: edge.node.fields.slug,
                    team: edge.node.fields.team,
                    map: edge.node.map,
                    image: getImage(mapImages[index]),
                  })
                })}
            </div>
          </div>
        )
      })}
    </Layout>
  )
}

export default MatchesPage
