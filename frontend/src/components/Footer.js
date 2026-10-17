import { Link } from "react-router-dom";
import { MapPin as FaLocationDot, Clock as FaClock, Users as FaUsers, ShieldCheck as FaUserShield, Landmark as FaBuildingColumns } from "lucide-react";
import { formatShort, formatTime } from "../utils";
import { COLLEGE } from "../data/college";
import SocialLinks from "./SocialLinks";
import { WEBSITES } from "../data/rules";

function Footer({ info }) {
  return (
    <footer className="footer-note">
      <div className="footer-brand">
        <FaBuildingColumns /> {COLLEGE.name}, {COLLEGE.place}
      </div>
      <SocialLinks info={info} />
      <span>
        <FaLocationDot /> {info.venue}
      </span>
      <span>
        <FaClock /> {formatShort(info.eventDate)} · {formatTime(info.startTime)} –{" "}
        {formatTime(info.endTime)}
      </span>
      <span>
        <FaUsers /> 18 events · PUC students only
      </span>
      <span className="footer-sites">
        {WEBSITES.map((w) => (
          <a key={w.url} href={w.url} target="_blank" rel="noopener noreferrer">{w.text}</a>
        ))}
      </span>
      <Link to="/admin" className="admin-link">
        <FaUserShield /> Admin portal
      </Link>
    </footer>
  );
}

export default Footer;
