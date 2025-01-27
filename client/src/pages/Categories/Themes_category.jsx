import React, { useEffect } from "react";
import ThemeCard from "../../pages/Categories/ThemeCard/ThemeCard";
import {
  faUmbrellaBeach,
  faPlaceOfWorship,
  faTree,
  faMountain,
  faHeart,
  faSuitcase,
} from "@fortawesome/free-solid-svg-icons";

const Themes_category = ({ themesData }) => {
  if (!themesData || Object.keys(themesData).length === 0) {
    return (
      <div className="text-center mt-5">
        <p>No Themes Available</p>
      </div>
    );
  }
  var BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
  }, [themesData]);

  // Define icons for each category using FontAwesome
  const categoryIcons = {
    honeymoon: faHeart,
    hillstations: faMountain,
    wildlife: faTree,
    heritage: faPlaceOfWorship,
    pilgrimage: faPlaceOfWorship,
    beach: faUmbrellaBeach,
  };

  return (
    <div className="container mt-5">
      <h4
        className=" text-uppercase mb-4"
        style={{ color: "rgba(40,41,65,1)" }}
      >
        Our Themes
      </h4>
      <div className="d-flex flex-wrap justify-content-center">
        {themesData?.map((categoryData, index) => {
          const categoryIcon =
            categoryIcons[categoryData.category.toLowerCase()] || faSuitcase;

          return categoryData.themes.map((theme, themeIndex) => (
            <div
              key={`${index}-${themeIndex}`}
              className="p-2 d-flex justify-content-start flex-wrap w-100 w-lg-auto"
              style={{ maxWidth: "200px" }} // Ensures a fixed width on large screens
            >
              {/* Render ThemeCard with the correct data */}
              <ThemeCard
                icon={categoryIcon} // Add icon for the category
                name={theme.name}
                tourPlanCount={theme.tourPlanCount}
              />
            </div>
          ));
        })}
      </div>
    </div>
  );
};

export default Themes_category;
