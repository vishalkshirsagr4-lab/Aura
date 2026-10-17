import { GraduationCap as FaUserGraduate, Users as FaPeopleGroup, Landmark as FaBuildingColumns, ClipboardList as FaClipboardList, Trophy as FaTrophy, Clock as FaClock } from "lucide-react";

function StatCard({ Icon, value, label, hue }) {
  return (
    <div className={`stat-card ${hue}`}>
      <div className="stat-card-icon">
        <Icon />
      </div>
      <div>
        <b>{value}</b>
        <span>{label}</span>
      </div>
    </div>
  );
}

function BarList({ rows, labelKey, valueKey, empty }) {
  const max = Math.max(1, ...rows.map((r) => r[valueKey]));
  if (rows.length === 0) return <p className="empty">{empty}</p>;
  return (
    <ul className="bars">
      {rows.map((r) => (
        <li key={r[labelKey]}>
          <div className="bar-label">
            <span>{r[labelKey]}</span>
            <b>{r[valueKey]}</b>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(r[valueKey] / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

// Registrations per day (from real registration dates) drawn as an SVG area chart
function TrendChart({ regs }) {
  const byDay = {};
  regs.forEach((r) => {
    const d = (r.createdAt || "").slice(0, 10);
    if (d) byDay[d] = (byDay[d] || 0) + 1;
  });
  const days = Object.keys(byDay).sort();
  if (days.length < 2) return <p className="empty">The trend appears after registrations arrive on at least two different days.</p>;
  const vals = days.map((d) => byDay[d]);
  const max = Math.max(...vals);
  const W = 600, H = 160, P = 10;
  const pts = vals.map((v, i) => [P + (i * (W - 2 * P)) / (vals.length - 1), H - P - (v / max) * (H - 2 * P)]);
  const line = pts.map((p) => p.join(",")).join(" ");
  return (
    <div className="trend">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Registrations per day" preserveAspectRatio="none">
        <defs>
          <linearGradient id="tg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#4f46e5" stopOpacity=".35" />
            <stop offset="1" stopColor="#4f46e5" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`${P},${H - P} ${line} ${W - P},${H - P}`} fill="url(#tg)" />
        <polyline points={line} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinejoin="round" />
        {pts.map((p, i) => <circle key={days[i]} cx={p[0]} cy={p[1]} r="4" fill="#06b6d4"><title>{`${days[i]}: ${vals[i]}`}</title></circle>)}
      </svg>
      <div className="trend-axis"><span>{days[0]}</span><b>Peak: {max} / day</b><span>{days[days.length - 1]}</span></div>
    </div>
  );
}

function Overview({ stats, regs }) {
  const topEvents = [...stats.eventRows]
    .sort((a, b) => b.registrations - a.registrations)
    .slice(0, 8);
  const topColleges = stats.collegeRows.slice(0, 8);
  const recent = regs.slice(0, 6);

  return (
    <div className="panel-stack">
      <div className="stat-cards">
        <StatCard Icon={FaUserGraduate} value={stats.totalStudents} label="Students registered" hue="h1" />
        <StatCard Icon={FaPeopleGroup} value={stats.totalTeams} label="Teams registered" hue="h2" />
        <StatCard Icon={FaBuildingColumns} value={stats.totalColleges} label="Colleges coming" hue="h3" />
        <StatCard Icon={FaClipboardList} value={stats.totalRegistrations} label="Total registrations" hue="h4" />
      </div>

      <section className="card">
        <h2><FaClock /> Registrations over time</h2>
        <TrendChart regs={regs} />
      </section>

      <div className="two-col">
        <section className="card">
          <h2>
            <FaTrophy /> Registrations by event
          </h2>
          <BarList
            rows={topEvents}
            labelKey="event"
            valueKey="registrations"
            empty="No registrations yet."
          />
        </section>

        <section className="card">
          <h2>
            <FaBuildingColumns /> Students by college
          </h2>
          <BarList
            rows={topColleges}
            labelKey="college"
            valueKey="students"
            empty="No colleges yet."
          />
        </section>
      </div>

      <section className="card">
        <h2>
          <FaClock /> Latest registrations
        </h2>
        {recent.length === 0 ? (
          <p className="empty">No registrations yet.</p>
        ) : (
          <ul className="recent">
            {recent.map((r) => (
              <li key={r._id}>
                <div>
                  <b>{r.fullname}</b>
                  <span>{r.college}</span>
                </div>
                <div className="recent-right">
                  <span className="chip">{r.event}</span>
                  <small>{new Date(r.createdAt).toLocaleString()}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Overview;
