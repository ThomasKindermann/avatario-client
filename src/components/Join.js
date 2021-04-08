import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Join = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input
            placeholder="Name"
            className="joinInput"
            type="text"
            onChange={(event) => setName(event.target.value)}
          />
          <input
            placeholder="Color"
            className="joinInput mt-20"
            type="text"
            onChange={(event) => setColor(event.target.value)}
          />
        </div>
        <Link
          onClick={(event) => (!name || !color ? event.preventDefault() : null)}
          to={"/Floor/?name=" + name + "&color=" + color}
        >
          <button className="button mt-20" type="submit">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
