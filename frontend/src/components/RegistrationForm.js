import { useState, useEffect } from "react";
import { CheckCircle2 as DoneIcon, FileText as DoneFile } from "lucide-react";
import { PDF_URL } from "../data/rules";
import { User as FaUser, Mail as FaEnvelope, School as FaSchool, Phone as FaPhone, Trophy as FaTrophy, Contact as FaIdCard, CheckCircle2 as FaCircleCheck, Info as FaCircleInfo, Check as FaCheck, Users as FaPeopleGroup } from "lucide-react";
import events from "../data/events";
import { formatShort, formatTime } from "../utils";

const initialState = {
  fullname: "",
  email: "",
  college: "",
  phone: "",
  event: "",
  pucRoll: "",
  teamName: "",
};

const fields = [
  { name: "fullname", label: "Full name", type: "text", Icon: FaUser, placeholder: "Your full name" },
  { name: "email", label: "Email", type: "email", Icon: FaEnvelope, placeholder: "you@example.com" },
  { name: "college", label: "PUC College", type: "text", Icon: FaSchool, placeholder: "Your PUC college" },
  { name: "phone", label: "Phone", type: "tel", Icon: FaPhone, placeholder: "10-digit mobile number", maxLength: 10 },
  { name: "event", label: "Select event", type: "select", Icon: FaTrophy },
  { name: "pucRoll", label: "PUC Roll No.", type: "text", Icon: FaIdCard, placeholder: "Your PUC roll number" },
  { name: "teamName", label: "Team name (optional)", type: "text", Icon: FaPeopleGroup, placeholder: "Leave blank if you are registering solo", full: true },
];

function RegistrationForm({ selectedEvent, info }) {
  const perks = [
    "Open to PUC students only",
    "Choose from 18 talent events",
    `${formatShort(info.eventDate)} · ${formatTime(info.startTime)} – ${formatTime(info.endTime)}`,
    "Team event? Use the same team name for every member",
  ];

  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  // When a card is tapped in the events grid, pre-select that event
  useEffect(() => {
    if (selectedEvent && selectedEvent.name) {
      setFormData((prev) => ({ ...prev, event: selectedEvent.name }));
    }
  }, [selectedEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear warnings while typing, keep success visible
    setMessage((prev) => (prev && prev.type === "warning" ? null : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullname, email, college, phone, event, pucRoll } = formData;

    if (
      !fullname.trim() ||
      !email.trim() ||
      !college.trim() ||
      !phone.trim() ||
      !event.trim() ||
      !pucRoll.trim()
    ) {
      setMessage({
        type: "warning",
        text: "Please fill in all fields before submitting.",
      });
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setMessage({
        type: "warning",
        text: "Please enter a valid email address.",
      });
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      setMessage({
        type: "warning",
        text: "Phone number must be exactly 10 digits.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage({
        type: "success",
        text: `Registered! ${fullname}, you are confirmed for "${event}". Take a screenshot of this message for your records.`,
      });
      setDone({ name: fullname, event });
      window.dispatchEvent(new Event("aura:registered"));
      setFormData(initialState);
    } catch (error) {
      setMessage({ type: "warning", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-card" id="register">
      <aside className="side">
        <h2>Reserve your spot</h2>
        <p>Pick your event, fill in your details and you're in.</p>
        <ul>
          {perks.map((perk) => (
            <li key={perk}>
              <FaCheck /> {perk}
            </li>
          ))}
        </ul>
      </aside>

      <div className="formwrap">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {fields.map(({ name, label, type, Icon, placeholder, maxLength, full }) => (
              <div className={`input-group${full ? " full" : ""}`} key={name}>
                <label htmlFor={name}>
                  <Icon /> {label}
                </label>
                {type === "select" ? (
                  <select
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                  >
                    <option value="">-- Choose an event --</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.name}>
                        {ev.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={name}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="btn-register" disabled={loading}>
            <FaCircleCheck />
            {loading ? "Submitting..." : "Confirm registration"}
          </button>
        </form>

        {message && (
          <div className={`message-box ${message.type}`} role="status">
            {message.type === "success" ? <FaCircleCheck /> : <FaCircleInfo />}
            <span>{message.text}</span>
          </div>
        )}
      </div>
      {done && (
        <div className="done-wrap" onClick={() => setDone(null)}>
          <div className="done" role="dialog" aria-modal="true" aria-label="Registration confirmed" onClick={(e) => e.stopPropagation()}>
            <div className="done-ico"><DoneIcon /></div>
            <h3>You're in, {String(done.name).split(" ")[0]}!</h3>
            <p>Registered for <b>{done.event}</b>.</p>
            <ul>
              <li><DoneIcon /> Registration begins at 9:00 AM on event day.</li>
              <li><DoneIcon /> Carry your valid college ID and Aadhaar card.</li>
              <li><DoneIcon /> Report at least 15 minutes before your event.</li>
            </ul>
            <div className="done-actions">
              <a className="cta small" href={PDF_URL} download="AI-AURA-2K26-Rules-and-Regulations.pdf"><DoneFile /> Download rules</a>
              <button type="button" className="ghost-btn" onClick={() => setDone(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default RegistrationForm;
