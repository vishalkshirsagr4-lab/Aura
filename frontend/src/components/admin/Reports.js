import { useState, useMemo } from "react";
import { ClipboardList as FaClipboardList, Trophy as FaTrophy, Landmark as FaBuildingColumns, Users as FaPeopleGroup, TrendingUp as FaChartLine, Download as FaDownload, Printer as FaPrint } from "lucide-react";
import { downloadCSV, formatShort } from "../../utils";

function buildReports(regs, stats) {
  return [
    {
      id: "all",
      title: "All registrations",
      Icon: FaClipboardList,
      file: "ai-aura-all-registrations.csv",
      columns: [
        { key: "no", label: "#" },
        { key: "fullname", label: "Full name" },
        { key: "email", label: "Email" },
        { key: "college", label: "College" },
        { key: "phone", label: "Phone" },
        { key: "event", label: "Event" },
        { key: "pucRoll", label: "PUC roll no." },
        { key: "teamName", label: "Team" },
        { key: "registeredOn", label: "Registered on" },
      ],
      rows: regs.map((r, i) => ({
        no: i + 1,
        fullname: r.fullname,
        email: r.email,
        college: r.college,
        phone: r.phone,
        event: r.event,
        pucRoll: r.pucRoll,
        teamName: r.teamName || "",
        registeredOn: new Date(r.createdAt).toLocaleString(),
      })),
    },
    {
      id: "events",
      title: "Event-wise report",
      Icon: FaTrophy,
      file: "ai-aura-event-wise.csv",
      columns: [
        { key: "event", label: "Event" },
        { key: "registrations", label: "Registrations" },
        { key: "teams", label: "Teams" },
      ],
      rows: stats.eventRows,
    },
    {
      id: "colleges",
      title: "College-wise report",
      Icon: FaBuildingColumns,
      file: "ai-aura-college-wise.csv",
      columns: [
        { key: "college", label: "College" },
        { key: "students", label: "Students" },
        { key: "registrations", label: "Registrations" },
      ],
      rows: stats.collegeRows,
    },
    {
      id: "teams",
      title: "Team report",
      Icon: FaPeopleGroup,
      file: "ai-aura-teams.csv",
      columns: [
        { key: "team", label: "Team name" },
        { key: "event", label: "Event" },
        { key: "memberCount", label: "Members" },
        { key: "members", label: "Member names" },
        { key: "colleges", label: "College(s)" },
      ],
      rows: stats.teamRows,
    },
    {
      id: "timeline",
      title: "Daily registrations",
      Icon: FaChartLine,
      file: "ai-aura-daily-registrations.csv",
      columns: [
        { key: "dateLabel", label: "Date" },
        { key: "count", label: "Registrations" },
      ],
      rows: stats.timeline.map((d) => ({
        dateLabel: formatShort(d.date),
        count: d.count,
      })),
    },
  ];
}

function Reports({ regs, stats }) {
  const [active, setActive] = useState("all");
  const reports = useMemo(() => buildReports(regs, stats), [regs, stats]);
  const report = reports.find((r) => r.id === active);

  return (
    <div className="panel-stack">
      <div className="report-picker no-print">
        {reports.map(({ id, title, Icon, rows }) => (
          <button
            key={id}
            className={`report-btn ${active === id ? "active" : ""}`}
            onClick={() => setActive(id)}
          >
            <Icon />
            <span>{title}</span>
            <small>{rows.length} rows</small>
          </button>
        ))}
      </div>

      <section className="card print-area">
        <div className="report-head">
          <h2>
            <report.Icon /> {report.title}
          </h2>
          <div className="report-actions no-print">
            <button
              className="btn-primary"
              onClick={() => downloadCSV(report.file, report.columns, report.rows)}
              disabled={report.rows.length === 0}
            >
              <FaDownload /> Download CSV
            </button>
            <button className="btn-ghost dark" onClick={() => window.print()}>
              <FaPrint /> Print / PDF
            </button>
          </div>
        </div>

        <p className="count">
          AI-AURA · generated {new Date().toLocaleString()} · {report.rows.length} rows
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {report.columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.rows.length === 0 && (
                <tr>
                  <td colSpan={report.columns.length} className="empty">
                    Nothing to report yet.
                  </td>
                </tr>
              )}
              {report.rows.map((row, i) => (
                <tr key={i}>
                  {report.columns.map((c) => (
                    <td key={c.key}>{row[c.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Reports;
