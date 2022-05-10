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
    `gatsby-transformer-json`,
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
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `QuakeWorld CTF Demo Archive`,
        short_name: `QTube`,
        start_url: `/`,
        background_color: `#663399`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
  ],
}
