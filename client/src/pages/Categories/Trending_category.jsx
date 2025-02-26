// import React from "react";
// import StateCard from "./Statecard/StateCard";

// const Trending_category = ({ trendingData }) => {
//   if (!trendingData || Object.keys(trendingData).length === 0) {
//     return <div className="text-center">No Trending Destinations Available</div>;
//   }
//   console.log(trendingData,'sdfsdfdf');
  
//   var BASE_URL = import.meta.env.VITE_BASE_URL;
//   return (
//     <div className="container mt-5">
//       <h4 className=" mb-4" style={{color :'rgba(40,41,65,1)'}}>TRENDING DESTINATIONS</h4>
//       <div className="row">
//         {Object.keys(trendingData).map((state, index) => {
//           const stateDetails = trendingData[state]?.stateDetails || {};
//           const cityDetails = trendingData[state]?.cities || {};
//           const stateImagePath = state.image || "";
//           const parts = stateImagePath.split("\\");
//           const stateName = parts[2];
//           const fileName = parts.pop();
//           console.log(state,'sss');
          

//           const stateImageURL = `${BASE_URL}/address/image?stateName=${encodeURIComponent(
//             stateName
//           )}&fileName=${encodeURIComponent(fileName)}`;

//           const firstCity = Object.keys(cityDetails)[0];
//           const firstPackage = cityDetails[firstCity]?.[0]?.name || "No Packages";

//           return (
//             <div key={index} className="col-md-4 col-lg-2 ">
//               <StateCard
//                 stateName={stateDetails.stateName || state}
//                 // stateImage={stateImageURL}
//                 stateImage={stateImagePath}
//                 startingPrice={stateDetails.startingPrice}
//                 cityCount={Object.keys(cityDetails).length}
//                 packageName={firstPackage}
//               />
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Trending_category;
import React from "react";
import StateCard from "./Statecard/StateCard";

const Trending_category = ({ trendingData }) => {
  if (!trendingData || trendingData.length === 0) {
    return <div className="text-center">No Trending Destinations Available</div>;
  }

  var BASE_URL = import.meta.env.VITE_BASE_URL;

  return (
    <div className="container mt-5">
      <h4 className="mb-4" style={{ color: "rgba(40,41,65,1)" }}>
        TRENDING DESTINATIONS
      </h4>
      <div className="row">
        {trendingData?.map((stateObj, index) => {
          const stateDetails = stateObj || {};
          const stateImagePath = stateDetails.image || "";
          const cityCount = stateDetails.tourPlans ? stateDetails.tourPlans.length : 0;
          const firstPackage = stateDetails.tourPlans?.[0]?.title || "No Packages";

          return (
            <div key={index} className="col-md-4 col-lg-2">
              <StateCard
                stateName={stateDetails.state || "Unknown State"}
                stateImage={stateImagePath}
                startingPrice={stateDetails.startingPrice}
                cityCount={cityCount}
                packageName={firstPackage}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Trending_category;
