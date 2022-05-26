import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as headerStyle from "./header.module.scss"

const Header = ({ siteTitle }) => (
    <header>
        <div className={headerStyle.navigationBar}>
            <ul>
                <li>
                    <a href="/">
                        <StaticImage placeholder="none" loading="eager" style={{ height: '3rem', width: '2em'}} imgStyle={{ objectFit: 'contain' }} src="../images/qtube.png"/>
                    </a>
                </li>
                <li>
                    <a href="/">
                        {siteTitle}
                    </a>
                </li>
                <li style={{float:"right", paddingRight: "0", paddingLeft: "1em"}}>
                    <a href="https://github.com/qw-ctf">
                        <StaticImage placeholder="none" loading="eager" style={{ height: '2.5rem', width: '1em'}} imgStyle={{ objectFit: 'contain' }}src="../images/github.png"/>
                    </a>
                </li>
                <li style={{float:"right", paddingRight: "0", paddingLeft: "1em"}}>
                    <a href="https://discord.gg/s32hb3H4mg">
                        <StaticImage placeholder="none" loading="eager" style={{ height: '2.8rem', width: '1em'}} imgStyle={{ objectFit: 'contain' }}src="../images/discord.png"/>
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
