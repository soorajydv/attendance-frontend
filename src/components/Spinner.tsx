import { useState, CSSProperties } from "react";
import { ClipLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#B268F9",
};

function Spinner() {
  let [color, setColor] = useState("#B268F9");

  return (
    <div className="sweet-loading w-full h-[90vh] flex justify-center items-center">
        
      <ClipLoader
        color={color}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Spinner;