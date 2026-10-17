import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck as FaUserShield, PieChart as FaChartPie, Users as FaUsers, FileText as FaFileLines, Megaphone as FaBullhorn, CalendarDays as FaCalendarDays, RefreshCw as FaRotate, ArrowLeft as FaArrowLeft, LogOut as FaRightFromBracket, Info as FaCircleInfo } from "lucide-react";
import { api } from "../../api";
import { buildStats } from "../../utils";
import Overview from "./Overview";
import RegistrationsTable from "./RegistrationsTable";
import Reports from "./Reports";
import AnnouncementsManager from "./AnnouncementsManager";
import EventSettings from "./EventSettings";

const TABS = [
  { id: "overview", label: "Overview", Icon: FaChartPie },
  { id: "students", label: "Registrations", Icon: FaUsers },
  { id: "reports", label: "Reports", Icon: FaFileLines },
  { id: "announce", label: "Announcements", Icon: FaBullhorn },
  { id: "info", label: "Event info", Icon: FaCalendarDays },
];

function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState("overview");
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/api/registrations", { auth: true });
      setRegs(data);
      setError("");
    } catch (err) {
      if (err.status === 401) {
        onLogout();
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => buildStats(regs), [regs]);

  const handleDelete = async (id) => {
    try {
      await api(`/api/registrations/${id}`, { method: "DELETE", auth: true });
      setRegs((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      if (err.status === 401) return onLogout();
      setError(err.message);
    }
  };

  return (
    <div className="admin">
      <header className="admin-top no-print">
        <div className="brand">
          <div className="brand-icon">
            <FaUserShield />
          </div>
          <div>
            <h1>AI-AURA Admin</h1>
            <p>Event control panel</p>
          </div>
        </div>
        <div className="top-actions">
          <button className="btn-ghost" onClick={load} disabled={loading}>
            <FaRotate /> {loading ? "Loading" : "Refresh"}
          </button>
          <Link to="/" className="btn-ghost">
            <FaArrowLeft /> Student portal
          </Link>
          <button className="btn-ghost danger" onClick={onLogout}>
            <FaRightFromBracket /> Logout
          </button>
        </div>
      </header>

      <nav className="tabs no-print">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`tab ${tab === id ? "active" : ""}`}
            onClick={() => setTab(id)}
          >
            <Icon /> {label}
          </button>
        ))}
      </nav>

      {error && (
        <div className="message-box warning no-print" role="alert">
          <FaCircleInfo />
          <span>{error}</span>
        </div>
      )}

      {tab === "overview" && <Overview stats={stats} regs={regs} />}
      {tab === "students" && (
        <RegistrationsTable regs={regs} onDelete={handleDelete} />
      )}
      {tab === "reports" && <Reports regs={regs} stats={stats} />}
      {tab === "announce" && <AnnouncementsManager onUnauthorized={onLogout} />}
      {tab === "info" && <EventSettings onUnauthorized={onLogout} />}
    </div>
  );
}

export default AdminDashboard;
