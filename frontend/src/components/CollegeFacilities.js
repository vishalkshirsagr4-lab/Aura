import { GraduationCap as FaGraduationCap } from "lucide-react";
import { FACILITIES } from "../data/college";

function CollegeFacilities() {
  return (
    <section className="facilities">
      <div className="section-title">
        <h2>
          <FaGraduationCap /> LIFE AT KLE BCA & BBA
        </h2>
        <p>What our students get beyond the classroom</p>
      </div>

      <div className="facility-grid">
        {FACILITIES.map(({ id, Icon, title, text }) => (
          <article className="facility tilt" key={id}>
            <div className="event-icon">
              <Icon />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>

    </section>
  );
}

export default CollegeFacilities;
