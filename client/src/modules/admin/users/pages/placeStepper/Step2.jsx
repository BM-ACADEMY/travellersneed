// import React from "react";
// import { Grid, TextField, Typography } from "@mui/material";

// const Step2 = ({ formData, onFormDataChange, placeType }) => {
//   const mode = formData.mode ?? "";
//   const from = formData.from ?? "";
//   const end = formData.end ?? "";
//   const transportDistance = formData.transportDistance ?? 0;
//   const duration = formData.duration ?? "";

//   return (
//     <>
//       {placeType === "city" ? (
//         <Grid container spacing={2}>
//           {/* Mode */}
//           <Grid item xs={12}>
//             <TextField
//               label="Mode of Transport"
//               fullWidth
//               name="mode"
//               value={mode} // Controlled value
//               onChange={(e) => onFormDataChange({ mode: e.target.value })}
//               required
//             />
//           </Grid>

//           {/* From */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Starting Point"
//               fullWidth
//               name="from"
//               value={from} // Controlled value
//               onChange={(e) => onFormDataChange({ from: e.target.value })}
//               required
//             />
//           </Grid>

//           {/* End */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Ending Point"
//               fullWidth
//               name="end"
//               value={end} // Controlled value
//               onChange={(e) => onFormDataChange({ end: e.target.value })}
//               required
//             />
//           </Grid>

//           {/* Distance */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Distance (in km)"
//               type="number"
//               fullWidth
//               name="transportDistance"
//               value={transportDistance} // Controlled value
//               onChange={(e) =>
//                 onFormDataChange({ transportDistance: parseFloat(e.target.value) || 0 })
//               }
//               required
//             />
//           </Grid>

//           {/* Duration */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Duration"
//               fullWidth
//               name="duration"
//               value={duration} // Controlled value
//               onChange={(e) => onFormDataChange({ duration: e.target.value })}
//               required
//             />
//           </Grid>
//         </Grid>
//       ) : (
//         <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 2 }}>
//           No form available for sub-places.
//         </Typography>
//       )}
//     </>
//   );
// };

// export default Step2;

// import React from "react";

// const Step2 = ({ formData, onFormDataChange, placeType }) => {
//   const mode = formData.mode ?? "";
//   const from = formData.from ?? "";
//   const end = formData.end ?? "";
//   const transportDistance = formData.transportDistance ?? 0;
//   const duration = formData.duration ?? "";

//   return (
//     <>
//       {placeType === "city" ? (
//         <div className="row g-3">
//           {/* Mode */}
//           <div className="col-12">
//             <label htmlFor="mode" className="form-label">
//               Mode of Transport
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="mode"
//               placeholder="Bus"
//               name="mode"
//               value={mode}
//               onChange={(e) => onFormDataChange({ mode: e.target.value })}
//               required
//             />
//           </div>

//           {/* From */}
//           <div className="col-12 col-sm-6">
//             <label htmlFor="from" className="form-label">
//               Starting Point
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="from"
//               placeholder="Chennai"
//               name="from"
//               value={from}
//               onChange={(e) => onFormDataChange({ from: e.target.value })}
//               required
//             />
//           </div>

//           {/* End */}
//           <div className="col-12 col-sm-6">
//             <label htmlFor="end" className="form-label">
//               Ending Point
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="end"
//               placeholder="Pondicherry"
//               name="end"
//               value={end}
//               onChange={(e) => onFormDataChange({ end: e.target.value })}
//               required
//             />
//           </div>

//           {/* Distance */}
//           <div className="col-12 col-sm-6">
//             <label htmlFor="transportDistance" className="form-label">
//               Distance (in km)
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               id="transportDistance"
//               name="transportDistance"
//               value={transportDistance}
//               placeholder="5.1kms"
//               onChange={(e) =>
//                 onFormDataChange({ transportDistance: parseFloat(e.target.value) || 0 })
//               }
//               required
//             />
//           </div>

//           {/* Duration */}
//           <div className="col-12 col-sm-6">
//             <label htmlFor="duration" className="form-label">
//               Duration
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="duration"
//               name="duration"
//               placeholder="2"
//               value={duration}
//               onChange={(e) => onFormDataChange({ duration: e.target.value })}
//               required
//             />
//           </div>
//         </div>
//       ) : (
//         <div className="text-center mt-3">
//           <h6 className="text-muted">No form available for sub-places.</h6>
//         </div>
//       )}
//     </>
//   );
// };

// export default Step2;

import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,

} from "@mui/material";
const Step2 = ({ formData, onFormDataChange, placeType }) => {
  const transports = formData.transports || [];

  const handleTransportChange = (index, field, value) => {
    const updatedTransports = [...transports];
    updatedTransports[index] = { ...updatedTransports[index], [field]: value };
    onFormDataChange({ transports: updatedTransports });
  };

  const addTransport = () => {
    onFormDataChange({
      transports: [
        ...transports,
        { mode: "", from: "", end: "", transportDistance: 0, duration: "" },
      ],
    });
  };

  const removeTransport = (index) => {
    const updatedTransports = transports.filter((_, i) => i !== index);
    onFormDataChange({ transports: updatedTransports });
  };

  return (
    <>
      {placeType === "city" ? (
        <div className="row g-3">
          {transports.map((transport, index) => (
            <div key={index} className="border p-3 rounded">
              <h6>Transport {index + 1}</h6>

              {/* Mode */}
              <div className="col-12">
                <label htmlFor={`mode-${index}`} className="form-label">
                  Mode of Transport
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`mode-${index}`}
                  placeholder="Bus"
                  value={transport.mode}
                  onChange={(e) =>
                    handleTransportChange(index, "mode", e.target.value)
                  }
                  required
                />
              </div>

              {/* From */}
              <div className="col-12 ">
                <label htmlFor={`from-${index}`} className="form-label">
                  Starting Point
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`from-${index}`}
                  placeholder="Chennai"
                  value={transport.from}
                  onChange={(e) =>
                    handleTransportChange(index, "from", e.target.value)
                  }
                  required
                />
              </div>

              {/* End */}
              <div className="col-12 ">
                <label htmlFor={`end-${index}`} className="form-label">
                  Ending Point
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`end-${index}`}
                  placeholder="Pondicherry"
                  value={transport.end}
                  onChange={(e) =>
                    handleTransportChange(index, "end", e.target.value)
                  }
                  required
                />
              </div>

              {/* Distance */}
              <div className="col-12">
                <label
                  htmlFor={`transportDistance-${index}`}
                  className="form-label"
                >
                  Distance (in km)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id={`transportDistance-${index}`}
                  placeholder="5.1 km"
                  value={transport.transportDistance}
                  onChange={(e) =>
                    handleTransportChange(
                      index,
                      "transportDistance",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  required
                />
              </div>

              {/* Duration */}
              <div className="col-12 ">
                <label htmlFor={`duration-${index}`} className="form-label">
                  Duration
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`duration-${index}`}
                  placeholder="2 hours"
                  value={transport.duration}
                  onChange={(e) =>
                    handleTransportChange(index, "duration", e.target.value)
                  }
                  required
                />
              </div>

              {/* Remove button */}
              <button
                type="button"
                className="btn btn-danger mt-2"
                onClick={() => removeTransport(index)}
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add More Button */}
          <div className="col-12 mt-3">
            <Button
              type="button"
              style={{
                backgroundColor: "#ef156c",
                textTransform: "none",
                color: "white",
                cursor: "pointer",
              }}
              onClick={addTransport}
            >
              Add More
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center mt-3">
          <h6 className="text-muted">No form available for sub-places.</h6>
        </div>
      )}
    </>
  );
};

export default Step2;
