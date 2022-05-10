const path = require(`path`)

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    experiments: {
      syncWebAssembly: true,
    },
  })
}

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === "MatchesJson") {
    const slug = node.demo.replace(".mvd", "").replaceAll(/[^A-Za-z0-9]/g, "-")

    const date = new Date(node.date)

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year_month_day = `${year}-${month}-${day}`

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
    createNodeField({ node, name: "date", value: year_month_day })
    createNodeField({ node, name: "epoch", value: epoch / 1000 })
    createNodeField({
      node,
      name: "sort_date",
      value: epoch - (epoch % (1000 * 60 * 60 * 24)),
    })
    createNodeField({ node, name: "team", value: team_scores })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const matchTemplate = path.resolve(`src/pages/match.js`)
  const result = await graphql(`
    query MyQuery {
      allMatchesJson {
        edges {
          node {
            demo
            map
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  result.data.allMatchesJson.edges.forEach(edge => {
    createPage({
      path: `${edge.node.fields.slug}`,
      component: matchTemplate,
      context: {
        demo: edge.node.demo,
        map: edge.node.map,
      },
    })
  })
}