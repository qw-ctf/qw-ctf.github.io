import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import FteComponent from "../components/fte"
import { window, document } from "browser-monads"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShare, faDownload } from "@fortawesome/free-solid-svg-icons"
import * as matchStyle from "./match.module.scss"
import { useTable, useSortBy } from "react-table"

function iOS() {
  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(window.navigator.platform) ||
    // iPad on iOS 13 detection
    (window.navigator.userAgent.includes("Mac") && "ontouchend" in document)
  )
}

const MatchStats = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: "frags",
            desc: true,
          },
        ],
      },
    },
    useSortBy
  )

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span style={{ fontSize: "0.7em" }}>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  if (i == 0) {
                    return <th {...cell.getCellProps()}>{cell.render("Cell")}</th>
                  }
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

const MatchPage = ({ pageContext: { demo, map, fragstats, events, players, directory, duration, matchStats } }) => {
  const baseUrl = "https://media.githubusercontent.com/media/qw-ctf/matches/main/"
  const demoUrl = `${baseUrl}${directory}/${encodeURIComponent(demo)}.gz`
  const columns = React.useMemo(
    () => [
      {
        Header: " ",
        columns: [
          {
            Header: "Name",
            accessor: "name",
            id: "header",
          },
          {
            Header: "Frags",
            accessor: "frags",
          },
          {
            Header: "Points",
            accessor: "ctf_points",
          },
          {
            Header: "Kills",
            accessor: "kills",
          },
          {
            Header: "Deaths",
            accessor: "deaths",
          },
        ],
      },
      {
        Header: "Powerups",
        columns: [
          {
            Header: "Quad",
            accessor: "quad_takes",
          },
          {
            Header: "Pent",
            accessor: "pent_takes",
          },
        ],
      },
      {
        Header: "Flag",
        columns: [
          {
            Header: "Captures",
            accessor: "flag_captures",
          },
          {
            Header: "Pickups",
            accessor: "flag_pickups",
          },
          {
            Header: "Defends",
            accessor: "flag_defends",
          },
          {
            Header: "Returns",
            accessor: "flag_returns",
          },
        ],
      },
      {
        Header: "Flag Carrier",
        columns: [
          {
            Header: "Defends",
            accessor: "flag_carrier_defends",
          },
          {
            Header: "Frags",
            accessor: "flag_carrier_frags",
          },
        ],
      },
      {
        Header: "Runes",
        columns: [
          {
            Header: "Res",
            accessor: "rune_time_res",
          },
          {
            Header: "Str",
            accessor: "rune_time_str",
          },
          {
            Header: "Hst",
            accessor: "rune_time_hst",
          },
          {
            Header: "Reg",
            accessor: "rune_time_reg",
          },
        ],
      },
      {
        Header: "Rocket Launcher",
        columns: [
          {
            Header: "Hits",
            accessor: "weapon_rl_hits",
          },
          {
            Header: "Attacks",
            accessor: "weapon_rl_attacks",
          },
        ],
      },
      {
        Header: "Lightning Gun",
        columns: [
          {
            Header: "Hits",
            accessor: "weapon_lg_hits",
          },
          {
            Header: "Attacks",
            accessor: "weapon_lg_attacks",
          },
        ],
      },
    ],
    []
  )

  // TODO: Figure out why map can be null here
  if (map == undefined) return <div />

  return (
    <Layout>
      <Seo title="demo" />
      {iOS() ? (
        "iOS browser performance is really bad, please fix, or use Desktop or Android"
      ) : (
        <FteComponent demo={demo} map={map.name} directory={directory} duration={duration} fragstats={fragstats} events={events} players={players} />
      )}
      <div className={matchStyle.matchInfo}>
        <div className={matchStyle.mapName}>
          {map.name.toUpperCase()}: {map.metadata.name} by {map.metadata.author || "Unknown"}
        </div>
        <div className={matchStyle.share}>
          <FontAwesomeIcon icon={faShare} />
          <span className={matchStyle.shareText}>Share</span>
        </div>
        <div className={matchStyle.download}>
          <a href={demoUrl}>
            <FontAwesomeIcon icon={faDownload} />
            <span className={matchStyle.downloadText}>Download</span>
          </a>
        </div>
      </div>
      <div className={matchStyle.tableWrap}>
        <MatchStats columns={columns} data={matchStats.players} />
      </div>
    </Layout>
  )
}

export default MatchPage
