import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component'; // Lazy Load library
import '../PackageCard/PackageCard.css';

const PackageCard = ({ tourPlan }) => {
  const {
    title,
    duration,
    baseFare,
    itSummaryTitle,
    images = [],
    itTourPlan,
    itPopular,
    tourCode
  } = tourPlan;

  // Extract tourCode and fileName from the first image path
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const VITE_GET_IMAGE_FOR_TOUR_PLAN = import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN.startsWith("http")
    ? import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN
    : `${BASE_URL}${import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN}`;
  // let tourCode = '';
  let fileName = '';
  // if (images.length > 0) {
  //   const parts = images[0].split('\\');
  //   tourCode = parts[0] || '';
  //   fileName = parts[1] || '';
  // }
  const lowerCaseTourCode = tourCode.toLowerCase();
  // Construct the image URL dynamically
  const imageUrl = `${VITE_GET_IMAGE_FOR_TOUR_PLAN}?tourCode=${encodeURIComponent(
    tourCode?.toUpperCase() || ""
  )}&fileName=${encodeURIComponent(fileName || "")}`;

  return (
    <Link className="" to={`/tour-plan/${lowerCaseTourCode}`} style={{ textDecoration: "none" }}>
      <div className="package-card">
        <div className="package-card-image">
          <LazyLoadImage
            // src={imageUrl}
            src={images[0]}
            alt={`Image for ${title}`}
            effect="blur"
            height="100%"
            width="100%"
            style={{
              objectFit: "cover", // Ensure the image covers the area without distortion
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          
          <div className="badge-container">
            {itTourPlan === "Y" && <span className="advanced-badge">Advanced</span>}
            {itPopular === "Y" && <span className="popular-badge">Popular</span>}
          </div>
        </div>

        <div className="package-card-details">
          <h3 className="package-title">{title}</h3>
          <p className="package-summary">{itSummaryTitle}</p>
          <div className="package-meta">
            <span>{duration} Days</span>
            <span>₹{baseFare}</span>
          </div>
          <Link className="package-cta" to={`/tour-plan/${tourCode}`}>
            View Details
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
