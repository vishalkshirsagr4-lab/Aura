import { useState, useEffect } from "react";
import {
  CheckCircle2 as DoneIcon,
  FileText as DoneFile,
  User as FaUser,
  Mail as FaEnvelope,
  School as FaSchool,
  Phone as FaPhone,
  Trophy as FaTrophy,
  Contact as FaIdCard,
  CheckCircle2 as FaCircleCheck,
  Info as FaCircleInfo,
  Check as FaCheck,
  Users as FaPeopleGroup,
  Loader2,
  Sparkles,
  Download,
} from "lucide-react";
import { PDF_URL } from "../data/rules";
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

const formFields = [
  { name: "fullname", label: "Full Name", type: "text", Icon: FaUser, placeholder: "e.g. Rahul Sharma" },
  { name: "email", label: "Email Address", type: "email", Icon: FaEnvelope, placeholder: "you@example.com" },
  { name: "college", label: "PUC College Name", type: "text", Icon: FaSchool, placeholder: "e.g. KLE PU College, Mahalingpur" },
  { name: "phone", label: "Mobile Number", type: "tel", Icon: FaPhone, placeholder: "10-digit mobile number", maxLength: 10 },
  { name: "event", label: "Select Event", type: "select", Icon: FaTrophy },
  { name: "pucRoll", label: "PUC Roll Number / ID", type: "text", Icon: FaIdCard, placeholder: "e.g. 24PUC108" },
  { name: "teamName", label: "Team Name (Optional for Group Events)", type: "text", Icon: FaPeopleGroup, placeholder: "Leave blank if participating solo", full: true },
];

function RegistrationForm({ selectedEvent, info }) {
  const perks = [
    "Open exclusively to PUC students",
    "Choose from 18 individual & team competitions",
    `${formatShort(info.eventDate)} · ${formatTime(info.startTime)} to ${formatTime(info.endTime)}`,
    "Team event? Every member registers with the same Team Name",
    "Participation certificates for all registered attendees",
  ];

  const [formData, setFormData] = useState(initialState);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);

  // Pre-select when card in explorer is tapped
  useEffect(() => {
    if (selectedEvent && selectedEvent.name) {
      setFormData((prev) => ({ ...prev, event: selectedEvent.name }));
    }
  }, [selectedEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (feedback && feedback.type === "warning") {
      setFeedback(null);
    }
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
      setFeedback({
        type: "warning",
        text: "Please complete all required fields before submitting.",
      });
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setFeedback({
        type: "warning",
        text: "Please enter a valid email address.",
      });
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      setFeedback({
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

      setFeedback({
        type: "success",
        text: `Registration confirmed for "${event}". You're all set!`,
      });
      setConfirmedData({
        name: fullname.trim(),
        event: event.trim(),
        college: college.trim(),
        roll: pucRoll.trim(),
      });
      window.dispatchEvent(new Event("aura:registered"));
      setFormData(initialState);
    } catch (error) {
      setFeedback({ type: "warning", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="registration-section" id="register" aria-label="Registration Form">
      <div className="section-header">
        <div className="section-badge">
          <Sparkles size={14} />
          <span>JOIN THE EVENT</span>
        </div>
        <h2>Official Student Registration</h2>
        <p className="section-subtitle">
          Secure your participation in AI-AURA 2026. Instant confirmation with zero entry fee.
        </p>
      </div>

      <div className="registration-layout">
        {/* Left Side: Information & Checklist */}
        <aside className="registration-perks-card">
          <div className="perks-head">
            <h3>Event Guidelines</h3>
            <p>Everything you need before submitting your entry</p>
          </div>
          <ul className="perks-list">
            {perks.map((perk) => (
              <li key={perk}>
                <div className="perk-check"><FaCheck size={14} /></div>
                <span>{perk}</span>
              </li>
            ))}
          </ul>

          <div className="perks-footer-note">
            <DoneFile size={16} />
            <span>Carry your college ID & Aadhaar card on event day for spot verification.</span>
          </div>
        </aside>

        {/* Right Side: Form */}
        <div className="registration-form-card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid-layout">
              {formFields.map(({ name, label, type, Icon, placeholder, maxLength, full }) => (
                <div className={`form-field-group ${full ? "full-width" : ""}`} key={name}>
                  <label htmlFor={name} className="field-label">
                    <Icon size={14} />
                    <span>{label}</span>
                    {name !== "teamName" && <span className="req-star">*</span>}
                  </label>

                  {type === "select" ? (
                    <div className="select-wrapper">
                      <select
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="">-- Choose an event --</option>
                        {events.map((ev) => (
                          <option key={ev.id} value={ev.name}>
                            #{String(ev.id).padStart(2, "0")} · {ev.name} ({ev.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <input
                      id={name}
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      maxLength={maxLength}
                      value={formData[name]}
                      onChange={handleChange}
                      className="form-control"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions-row">
              <button
                type="submit"
                className="btn-primary form-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <FaCircleCheck size={18} />
                    <span>Confirm Registration</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {feedback && (
            <div
              className={`form-feedback-box ${feedback.type === "success" ? "success" : "warning"}`}
              role={feedback.type === "success" ? "status" : "alert"}
            >
              {feedback.type === "success" ? (
                <FaCircleCheck size={18} />
              ) : (
                <FaCircleInfo size={18} />
              )}
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal Dialog */}
      {confirmedData && (
        <div
          className="modal-backdrop"
          onClick={() => setConfirmedData(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Registration Successful"
        >
          <div
            className="confirmation-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="conf-icon-wrap">
              <DoneIcon size={36} />
            </div>

            <h3>You're In, {confirmedData.name.split(" ")[0]}!</h3>
            <p className="conf-subtitle">
              Successfully registered for <b>{confirmedData.event}</b>
            </p>

            <div className="conf-details-box">
              <div className="conf-row">
                <span>College:</span>
                <b>{confirmedData.college}</b>
              </div>
              <div className="conf-row">
                <span>Roll No:</span>
                <b>{confirmedData.roll}</b>
              </div>
            </div>

            <ul className="conf-instructions">
              <li>
                <DoneIcon size={15} />
                <span>Reporting time: 09:00 AM on event day at the registration desk.</span>
              </li>
              <li>
                <DoneIcon size={15} />
                <span>Keep a screenshot of this confirmation for hassle-free entry.</span>
              </li>
              <li>
                <DoneIcon size={15} />
                <span>Bring your College ID card and Aadhaar card.</span>
              </li>
            </ul>

            <div className="conf-actions">
              <a
                className="btn-primary small"
                href={PDF_URL}
                download="AI-AURA-2K26-Rules-and-Regulations.pdf"
              >
                <Download size={15} />
                <span>Download Rules PDF</span>
              </a>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setConfirmedData(null)}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default RegistrationForm;
