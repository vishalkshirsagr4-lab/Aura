import { useState, useEffect } from "react";
import { CalendarDays as FaCalendarDays, Clock as FaClock, MapPin as FaLocationDot, Save as FaFloppyDisk, CheckCircle2 as FaCircleCheck, Info as FaCircleInfo, Instagram as FaInstagram, Youtube as FaYoutube, Facebook as FaFacebook, Linkedin as FaLinkedin, Globe as FaGlobe } from "lucide-react";
import { api } from "../../api";
import { DEFAULT_INFO } from "../../utils";

const SOCIAL_FIELDS = [
  { name: "instagram", label: "Instagram", Icon: FaInstagram, placeholder: "https://instagram.com/your-college" },
  { name: "youtube", label: "YouTube", Icon: FaYoutube, placeholder: "https://youtube.com/@your-college" },
  { name: "facebook", label: "Facebook", Icon: FaFacebook, placeholder: "https://facebook.com/your-college" },
  { name: "linkedin", label: "LinkedIn", Icon: FaLinkedin, placeholder: "https://linkedin.com/school/your-college" },
  { name: "website", label: "Website", Icon: FaGlobe, placeholder: "https://your-college-website.edu" },
];

function EventSettings({ onUnauthorized }) {
  const [form, setForm] = useState(DEFAULT_INFO);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api("/api/settings")
      .then((data) => setForm({ ...DEFAULT_INFO, ...data }))
      .catch((err) => setMsg({ type: "warning", text: err.message }));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.eventDate || !form.startTime || !form.endTime || !form.venue.trim()) {
      setMsg({ type: "warning", text: "Please fill in the date, times and venue." });
      return;
    }
    setSaving(true);
    try {
      await api("/api/settings", { method: "PUT", body: form, auth: true });
      setMsg({ type: "success", text: "Saved. The student portal now shows the new details." });
    } catch (err) {
      if (err.status === 401) return onUnauthorized();
      setMsg({ type: "warning", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="card narrow">
      <h2>
        <FaCalendarDays /> Event info and social links
      </h2>
      <p className="hint">
        The date, time and venue appear in the hero, countdown, registration panel and footer.
        Social links appear in the campus section and footer.
      </p>

      <form onSubmit={handleSubmit} noValidate className="stack-form">
        <div className="input-group">
          <label htmlFor="eventDate">
            <FaCalendarDays /> Event date
          </label>
          <input id="eventDate" name="eventDate" type="date" value={form.eventDate} onChange={handleChange} />
        </div>

        <div className="form-row">
          <div className="input-group">
            <label htmlFor="startTime">
              <FaClock /> Start time
            </label>
            <input id="startTime" name="startTime" type="time" value={form.startTime} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label htmlFor="endTime">
              <FaClock /> End time
            </label>
            <input id="endTime" name="endTime" type="time" value={form.endTime} onChange={handleChange} />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="venue">
            <FaLocationDot /> Venue
          </label>
          <input id="venue" name="venue" maxLength={120} value={form.venue} onChange={handleChange} />
        </div>

        <h3 className="subhead-admin">College social media (leave blank to hide)</h3>
        {SOCIAL_FIELDS.map(({ name, label, Icon, placeholder }) => (
          <div className="input-group" key={name}>
            <label htmlFor={name}>
              <Icon /> {label}
            </label>
            <input
              id={name}
              name={name}
              type="url"
              placeholder={placeholder}
              value={form[name] || ""}
              onChange={handleChange}
            />
          </div>
        ))}

        <button type="submit" className="btn-primary" disabled={saving}>
          <FaFloppyDisk /> {saving ? "Saving..." : "Save"}
        </button>
      </form>

      {msg && (
        <div className={`message-box ${msg.type}`} role="status">
          {msg.type === "success" ? <FaCircleCheck /> : <FaCircleInfo />}
          <span>{msg.text}</span>
        </div>
      )}
    </section>
  );
}

export default EventSettings;
