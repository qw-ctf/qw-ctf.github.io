import * as React from "react"
import PropTypes from "prop-types"
import { StaticImage } from "gatsby-plugin-image"
import * as headerStyle from "./header.module.scss"

const Header = ({ siteTitle }) => (
    <header>
        <div className={headerStyle.navigationBar}>
            <ul>
                <li>
                    <a href="/">
                        <StaticImage placeholder="none" loading="eager" className={headerStyle.logo} imgStyle={{ objectFit: 'contain' }} src="../images/qtube.png"/>
                    </a>
                </li>
                <li>
                    <a href="/">
                        <span className={headerStyle.name}>{siteTitle}</span>
                    </a>
                </li>
                <li className={headerStyle.rightAlign}>
                    <a href="https://github.com/qw-ctf">
                        <StaticImage placeholder="none" loading="eager" className={headerStyle.githubIcon} imgStyle={{ objectFit: 'contain' }}src="../images/github.png"/>
                    </a>
                </li>
                <li style={{float:"right", paddingRight: "0", paddingLeft: "1em"}}>
                    <a href="https://discord.gg/s32hb3H4mg">
                        <StaticImage placeholder="none" loading="eager" className={headerStyle.discordIcon} imgStyle={{ objectFit: 'contain' }}src="../images/discord.png"/>
                    </a>
                </li>
            </ul>
        </div>
    </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
