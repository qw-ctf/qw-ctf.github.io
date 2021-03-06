module.exports = {
  siteMetadata: {
    title: `QTube`,
    description: `QuakeWorld CTF Demo Archive`,
    author: `@dsvensson`,
    siteUrl: `https://qw-ctf.github.io/qtube/`,
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: ["png"]
        }
      }
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-transformer-json`,
      options: {
        typeName: ({ node, object, isArray }) => "MatchJson"
      }
    },
    `gatsby-plugin-fontawesome-css`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `matches`,
        path: `${__dirname}/src/matches`,
        ignore: [`**/*\.extra\.json`]
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `QuakeWorld CTF Demo Archive`,
        short_name: `QTube`,
        start_url: `/`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`,
      },
    },
  ],
}
