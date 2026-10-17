import { Instagram as FaInstagram, Youtube as FaYoutube, Facebook as FaFacebook, Linkedin as FaLinkedin, Globe as FaGlobe } from "lucide-react";

const LINKS = [
  { key: "instagram", label: "Instagram", Icon: FaInstagram },
  { key: "youtube", label: "YouTube", Icon: FaYoutube },
  { key: "facebook", label: "Facebook", Icon: FaFacebook },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedin },
  { key: "website", label: "Website", Icon: FaGlobe },
];

// Shows only the links the admin has filled in (Admin → Event info)
function SocialLinks({ info }) {
  const active = LINKS.filter((l) => info[l.key]);
  if (active.length === 0) return null;

  return (
    <div className="social">
      {active.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={info[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}

export default SocialLinks;
