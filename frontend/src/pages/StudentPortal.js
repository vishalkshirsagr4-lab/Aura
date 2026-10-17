import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Announcements from "../components/Announcements";
import Marquee from "../components/Marquee";
import StatsBand from "../components/StatsBand";
import EventExplorer from "../components/EventExplorer";
import RulesSection from "../components/RulesSection";
import CollegeFacilities from "../components/CollegeFacilities";
import CollegeGallery from "../components/CollegeGallery";
import LiveRegistrations from "../components/LiveRegistrations";
import PosterPopup from "../components/PosterPopup";
import StickyNav from "../components/StickyNav";
import RegistrationForm from "../components/RegistrationForm";
import Footer from "../components/Footer";
import { api } from "../api";
import useTilt from "../useTilt";
import useReveal from "../hooks/useReveal";
import { DEFAULT_INFO } from "../utils";

function StudentPortal() {
  useTilt();
  useReveal();
  // { name, key } — key changes on every click so re-selecting the same event still works
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [info, setInfo] = useState(DEFAULT_INFO);
  const [notices, setNotices] = useState([]);

  // Event info + announcements are managed from the admin portal
  useEffect(() => {
    api("/api/settings")
      .then((data) => setInfo({ ...DEFAULT_INFO, ...data }))
      .catch(() => {});
    api("/api/announcements")
      .then(setNotices)
      .catch(() => {});
  }, []);

  const pick = (name) => setSelectedEvent({ name, key: Date.now() });

  return (
    <div className="wrapper" id="top">
      <PosterPopup />
      <StickyNav />
      <LiveRegistrations />
      <Hero info={info} />
      <Marquee />
      <div className="reveal"><Announcements items={notices} /></div>
      <div className="reveal"><StatsBand /></div>
      <div className="reveal"><EventExplorer onSelect={pick} /></div>
      <div className="reveal"><RulesSection /></div>
      <div className="reveal" id="college"><CollegeFacilities /></div>
      <div className="reveal" id="seminars"><CollegeGallery /></div>
      <div className="reveal"><RegistrationForm selectedEvent={selectedEvent} info={info} /></div>
      <Footer info={info} />
    </div>
  );
}

export default StudentPortal;
