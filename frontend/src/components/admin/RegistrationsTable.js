import { useState, useMemo } from "react";
import { Search as FaMagnifyingGlass, Trash2 as FaTrash } from "lucide-react";
import events from "../../data/events";

function RegistrationsTable({ regs, onDelete }) {
  const [query, setQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return regs.filter((r) => {
      if (eventFilter && r.event !== eventFilter) return false;
      if (!q) return true;
      return [r.fullname, r.email, r.college, r.phone, r.pucRoll, r.teamName]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [regs, query, eventFilter]);

  const confirmDelete = (r) => {
    if (window.confirm(`Delete the registration of ${r.fullname}?`)) {
      onDelete(r._id);
    }
  };

  return (
    <section className="card">
      <div className="toolbar">
        <div className="search">
          <FaMagnifyingGlass />
          <input
            placeholder="Search name, email, college, phone, roll, team"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
          <option value="">All events</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.name}>
              {ev.name}
            </option>
          ))}
        </select>
      </div>

      <p className="count">
        Showing {rows.length} of {regs.length} registrations
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Phone</th>
              <th>Event</th>
              <th>Roll no.</th>
              <th>Team</th>
              <th>Registered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="10" className="empty">
                  No registrations found.
                </td>
              </tr>
            )}
            {rows.map((r, i) => (
              <tr key={r._id}>
                <td>{i + 1}</td>
                <td>{r.fullname}</td>
                <td>{r.email}</td>
                <td>{r.college}</td>
                <td>{r.phone}</td>
                <td>{r.event}</td>
                <td>{r.pucRoll}</td>
                <td>{r.teamName || "—"}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="icon-btn danger"
                    onClick={() => confirmDelete(r)}
                    aria-label={`Delete ${r.fullname}`}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RegistrationsTable;
