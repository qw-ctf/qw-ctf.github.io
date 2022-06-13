const path = require(`path`)
const fs = require("fs")
const { resourceLimits } = require("worker_threads")

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    experiments: {
      syncWebAssembly: true,
    },
  })
}

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === "MatchJson") {
    const slug = node.demo.replace(".mvd", "").replace(/[^A-Za-z0-9]/g, "-")

    const date = new Date(node.date)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)

    const team_scores = {
      red: { frags: 0, players: 0 },
      blue: { frags: 0, players: 0 },
    }

    for (let i = 0; i < node.players.length; i++) {
      team_scores[node.players[i].team]["frags"] += node.players[i].stats.frags
      team_scores[node.players[i].team]["players"] += 1
    }

    const epoch = Date.parse(node.date)

    createNodeField({ node, name: "slug", value: slug })
    createNodeField({ node, name: "date", value: date })
    createNodeField({ node, name: "epoch", value: epoch / 1000 })
    createNodeField({
      node,
      name: "sort_date",
      value: epoch - (epoch % (1000 * 60 * 60 * 24)),
    })
    createNodeField({ node, name: "team", value: team_scores })
  }
}

const lookupTable = {
  0: "•",
  5: "•",
  14: "•",
  15: "•",
  16: "[",
  17: "]",
  18: "0",
  19: "1",
  20: "2",
  21: "3",
  22: "4",
  23: "5",
  24: "6",
  25: "7",
  26: "8",
  27: "9",
  28: "•"
}


function normalizeName(name) {
  let result = ""
  for (let i = 0; i < name.length; i++) {
    let code = name.charCodeAt(i)
    if (code > 127) {
      code -= 128
    }
    if (code >= 32 && code < 127) {
      result += String.fromCharCode(code)
    } else {
      result += lookupTable[code] || " "
    }
  }
  return result
}

function prepareTableData(duration, stats) {
  const result = {
    players: [],
    teams: [{}, {}]
  }
  for (let i = 0; i < stats.length; i++) {
    result.players.push({
      name: normalizeName(stats[i].name),
      team: stats[i].team,
      frags: stats[i].stats.frags,
      kills: stats[i].stats.kills,
      deaths: stats[i].stats.deaths,
      quad_takes: (stats[i].items.q || { took: 0 }).took,
      pent_takes: (stats[i].items.p || { took: 0 }).took,
      ctf_points: stats[i].ctf.points || 0,
      flag_pickups: stats[i].ctf.pickups || 0,
      flag_captures: stats[i].ctf.caps || 0,
      flag_defends: stats[i].ctf.defends || 0,
      flag_returns: stats[i].ctf.returns || 0,
      flag_carrier_defends: stats[i].ctf.carrier_defends || 0,
      flag_carrier_frags: stats[i].ctf.carrier_frags || 0,
      rune_time_res: Math.floor((stats[i].ctf.runes[0] * 100.0) / duration).toString() + "%",
      rune_time_str: Math.floor((stats[i].ctf.runes[1] * 100.0) / duration).toString() + "%",
      rune_time_hst: Math.floor((stats[i].ctf.runes[2] * 100.0) / duration).toString() + "%",
      rune_time_reg: Math.floor((stats[i].ctf.runes[3] * 100.0) / duration).toString() + "%",
      weapon_rl_hits: ((stats[i].weapons.rl || { acc: null }).acc || { virtual: 0 }).virtual,
      weapon_rl_attacks: ((stats[i].weapons.rl || { acc: null }).acc || { attacks: 0 }).attacks,
      weapon_lg_hits: ((stats[i].weapons.lg || { acc: null }).acc || { hits: 0 }).hits,
      weapon_lg_attacks: ((stats[i].weapons.lg || { acc: null }).acc || { attacks: 0 }).attacks
    })
    const team = (stats[i].team == "red" ? result.teams[0] : result.teams[1])
    team.frags += (team.frags || 0) + result.players[i].frags
    team.kills += (team.kills || 0) + result.players[i].kills
    team.deaths += (team.deaths || 0) + result.players[i].deaths
    team.quad_takes += (team.quad_takes || 0) + result.players[i].quad_takes
    team.pent_takes += (team.pent_takes || 0) + result.players[i].pent_takes
    team.ctf_points += (team.ctf_points || 0) + result.players[i].ctf_points
    team.flag_pickups += (team.flag_pickups || 0) + result.players[i].flag_pickups
    team.flag_captures += (team.flag_captures || 0) + result.players[i].flag_captures
    team.flag_defends += (team.flag_defends || 0) + result.players[i].flag_defends
    team.flag_returns += (team.flag_returns || 0) + result.players[i].flag_returns
    team.flag_carrier_defends += (team.flag_carrier_defends || 0) + result.players[i].flag_carrier_defends
    team.flag_carrier_frags += (team.flag_carrier_frags || 0) + result.players[i].flag_carrier_frags
    team.rune_time_res += (team.rune_time_res || 0) + stats[i].ctf.runes[0]
    team.rune_time_str += (team.rune_time_str || 0) + stats[i].ctf.runes[1]
    team.rune_time_hst += (team.rune_time_hst || 0) + stats[i].ctf.runes[2]
    team.rune_time_reg += (team.rune_time_reg || 0) + stats[i].ctf.runes[3]
    team.weapon_rl_hits += (team.weapon_rl_hits || 0) + result.players[i].weapon_rl_hits
    team.weapon_rl_attacks += (team.weapon_rl_attacks || 0) + result.players[i].weapon_rl_attacks
    team.weapon_lg_hits += (team.weapon_lg_hits || 0) + result.players[i].weapon_lg_hits
    team.weapon_lg_attacks += (team.weapon_lg_attacks || 0) + result.players[i].weapon_lg_attacks
  }
  result.teams[0].rune_time_res = Math.floor((result.teams[0].rune_time_res * 100.0) / duration).toString() + "%"
  result.teams[1].rune_time_res = Math.floor((result.teams[1].rune_time_res * 100.0) / duration).toString() + "%"
  result.teams[0].rune_time_str = Math.floor((result.teams[0].rune_time_str * 100.0) / duration).toString() + "%"
  result.teams[1].rune_time_str = Math.floor((result.teams[1].rune_time_str * 100.0) / duration).toString() + "%"
  result.teams[0].rune_time_hst = Math.floor((result.teams[0].rune_time_hst * 100.0) / duration).toString() + "%"
  result.teams[1].rune_time_hst = Math.floor((result.teams[1].rune_time_hst * 100.0) / duration).toString() + "%"
  result.teams[0].rune_time_reg = Math.floor((result.teams[0].rune_time_reg * 100.0) / duration).toString() + "%"
  result.teams[1].rune_time_reg = Math.floor((result.teams[1].rune_time_reg * 100.0) / duration).toString() + "%"
  return result
}


exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const mapMetadata = JSON.parse(fs.readFileSync("data/map.metadata.json"))
  const matchTemplate = path.resolve(`src/pages/match.js`)
  const result = await graphql(`
    query Pages {
      pages: allMatchJson {
        edges {
          node {
            demo
            map
            duration
            fragstats {
              timestamp
              red
              blue
            }
            events {
              timestamp
              uid
              y
              type
              count
              meta
            }
            fields {
              slug
            }
            parent {
              ... on File {
                directory: relativeDirectory
              }
            }
            players {
              uid
              ctf {
                caps
                carrier_defends
                carrier_frags
                defends
                pickups
                points
                returns
                runes
              }
              stats {
                deaths
                kills
                frags
              }
              items {
                p {
                  took
                }
                q {
                  took
                }
              }
              weapons {
                rl {
                  acc {
                    virtual
                    attacks
                  }
                }
                lg {
                  acc {
                    hits
                    attacks
                  }
                }
              }
              name
              team
            }
          }
        }
      }
    }
  `)
  result.data.pages.edges.forEach(edge => {
    players = {}
    for (let i = 0; i < edge.node.players.length; i++) {
      players[edge.node.players[i].uid] = {
        "name": normalizeName(edge.node.players[i].name),
        "team": edge.node.players[i].team
      }
    }
    createPage({
      path: `match/${edge.node.parent.directory}/${edge.node.fields.slug}`,
      component: matchTemplate,
      context: {
        demo: edge.node.demo,
        map: {
          name: edge.node.map,
          metadata: mapMetadata[edge.node.map],
        },
        fragstats: edge.node.fragstats,
        events: edge.node.events,
        players: players,
        directory: edge.node.parent.directory,
        duration: edge.node.duration,
        matchStats: prepareTableData(edge.node.duration, edge.node.players),
      },
    })
  })
}
