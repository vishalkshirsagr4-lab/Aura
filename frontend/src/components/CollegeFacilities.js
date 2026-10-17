import { useState } from "react";
import { GraduationCap as FaGraduationCap, BookOpen, Layers, CheckCircle } from "lucide-react";
import { FACILITIES, COURSES, COLLEGE } from "../data/college";

function CollegeFacilities() {
  const [activeCourseTab, setActiveCourseTab] = useState("BCA");

  return (
    <section className="facilities-section" id="courses" aria-label="College Facilities and Programs">
      <div className="section-header">
        <div className="section-badge">
          <FaGraduationCap size={14} />
          <span>ACADEMIC EXCELLENCE</span>
        </div>
        <h2>Life & Learning at {COLLEGE.name}</h2>
        <p className="section-subtitle">
          Beyond textbook syllabus: skill certifications, industry hackathons, and placement grooming every semester
        </p>
      </div>

      {/* 6 Key Facilities Cards */}
      <div className="facility-cards-grid">
        {FACILITIES.map(({ id, Icon, title, text }) => (
          <article className="facility-card" key={id}>
            <div className="facility-icon-wrap">
              <Icon size={22} />
            </div>
            <h3 className="facility-title">{title}</h3>
            <p className="facility-desc">{text}</p>
          </article>
        ))}
      </div>

      {/* Semester-wise Certificate Courses Showcase */}
      <div className="courses-showcase-box">
        <div className="courses-head">
          <div className="courses-title-group">
            <Layers className="courses-sparkle" size={20} />
            <div>
              <h3>Semester-wise Value Added Certificate Courses</h3>
              <p>Practical tech & business skills taught alongside the university degree</p>
            </div>
          </div>

          <div className="course-degree-tabs" role="tablist" aria-label="Degree selector">
            <button
              type="button"
              className={`degree-tab ${activeCourseTab === "BCA" ? "active" : ""}`}
              onClick={() => setActiveCourseTab("BCA")}
            >
              BCA Curriculum
            </button>
            <button
              type="button"
              className={`degree-tab ${activeCourseTab === "BBA" ? "active" : ""}`}
              onClick={() => setActiveCourseTab("BBA")}
            >
              BBA Curriculum
            </button>
          </div>
        </div>

        <div className="courses-grid">
          {COURSES[activeCourseTab]?.map((semBlock) => (
            <div className="course-sem-card" key={semBlock.sem}>
              <div className="sem-header">
                <span className="sem-badge">Semester {semBlock.sem}</span>
              </div>
              <ul className="sem-items-list">
                {semBlock.items.map((item) => (
                  <li key={item}>
                    <CheckCircle size={14} className="sem-item-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CollegeFacilities;
