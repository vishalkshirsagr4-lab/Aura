import { useState, useEffect, useCallback } from "react";
import { Megaphone as FaBullhorn, CalendarDays as FaCalendarDays, AlertTriangle as FaTriangleExclamation, Plus as FaPlus, Save as FaFloppyDisk, Pen as FaPen, Trash2 as FaTrash, CheckCircle2 as FaCircleCheck, Info as FaCircleInfo, X as FaXmark } from "lucide-react";
import { api } from "../../api";
import { formatShort } from "../../utils";

const CATEGORY = {
  general: { Icon: FaBullhorn, label: "Update" },
  date: { Icon: FaCalendarDays, label: "Date" },
  important: { Icon: FaTriangleExclamation, label: "Important" },
};

const EMPTY = { title: "", message: "", category: "general", date: "" };

function AnnouncementsManager({ onUnauthorized }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await api("/api/announcements"));
    } catch (err) {
      setMsg({ type: "warning", text: err.message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMsg(null);
  };

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      setMsg({ type: "warning", text: "Title and message are required." });
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api(`/api/announcements/${editingId}`, { method: "PUT", body: form, auth: true });
      } else {
        await api("/api/announcements", { method: "POST", body: form, auth: true });
      }
      setMsg({
        type: "success",
        text: editingId ? "Announcement updated." : "Announcement published to the student portal.",
      });
      reset();
      load();
    } catch (err) {
      if (err.status === 401) return onUnauthorized();
      setMsg({ type: "warning", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (n) => {
    setEditingId(n._id);
    setForm({
      title: n.title,
      message: n.message,
      category: n.category,
      date: n.date || "",
    });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (n) => {
    if (!window.confirm(`Delete "${n.title}"?`)) return;
    try {
      await api(`/api/announcements/${n._id}`, { method: "DELETE", auth: true });
      if (editingId === n._id) reset();
      load();
    } catch (err) {
      if (err.status === 401) return onUnauthorized();
      setMsg({ type: "warning", text: err.message });
    }
  };

  return (
    <div className="two-col wide-left">
      <section className="card">
        <h2>
          <FaBullhorn /> {editingId ? "Edit announcement" : "New announcement"}
        </h2>
        <p className="hint">Everything you post here appears in the student portal instantly.</p>

        <form onSubmit={handleSubmit} noValidate className="stack-form">
          <div className="input-group">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" maxLength={120} placeholder="e.g. Reporting time changed" value={form.title} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="4" maxLength={1000} placeholder="Write the announcement" value={form.message} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="category">Type</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                <option value="general">Update</option>
                <option value="date">Date / schedule</option>
                <option value="important">Important</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="date">Date (optional)</label>
              <input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {editingId ? <FaFloppyDisk /> : <FaPlus />}
              {saving ? "Saving..." : editingId ? "Save changes" : "Publish"}
            </button>
            {editingId && (
              <button type="button" className="btn-ghost dark" onClick={reset}>
                <FaXmark /> Cancel
              </button>
            )}
          </div>
        </form>

        {msg && (
          <div className={`message-box ${msg.type}`} role="status">
            {msg.type === "success" ? <FaCircleCheck /> : <FaCircleInfo />}
            <span>{msg.text}</span>
          </div>
        )}
      </section>

      <section className="card">
        <h2>
          <FaBullhorn /> Published ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="empty">No announcements yet.</p>
        ) : (
          <ul className="notice-admin-list">
            {items.map((n) => {
              const cat = CATEGORY[n.category] || CATEGORY.general;
              const Icon = cat.Icon;
              return (
                <li key={n._id}>
                  <div className="na-main">
                    <div className="na-title">
                      <Icon /> <b>{n.title}</b>
                      <span className="chip">{cat.label}</span>
                    </div>
                    <p>{n.message}</p>
                    {n.date && (
                      <small>
                        <FaCalendarDays /> {formatShort(n.date)}
                      </small>
                    )}
                  </div>
                  <div className="na-actions">
                    <button className="icon-btn" onClick={() => startEdit(n)} aria-label="Edit">
                      <FaPen />
                    </button>
                    <button className="icon-btn danger" onClick={() => remove(n)} aria-label="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AnnouncementsManager;
