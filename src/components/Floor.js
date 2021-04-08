import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "../App.css";

const ENDPOINT = "localhost:5000";
let socket;

const Floor = ({ location }) => {
  const windowDimensions = useWindowResize();
  // Calling Key Listener Hook
  const ArrowUp = useKeyPress("ArrowUp");
  const ArrowDown = useKeyPress("ArrowDown");
  const ArrowLeft = useKeyPress("ArrowLeft");
  const ArrowRight = useKeyPress("ArrowRight");
  const wKey = useKeyPress("w");
  const aKey = useKeyPress("a");
  const sKey = useKeyPress("s");
  const dKey = useKeyPress("d");

  const [avatars, setAvatars] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [x, setX] = useState(Math.floor(Math.random() * 760));
  const [y, setY] = useState(Math.floor(Math.random() * 660));

  var connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  useEffect(() => {
    const { name, color } = queryString.parse(location.search);
    socket = io.connect(ENDPOINT, connectionOptions);
    setName(name);
    setColor(color);

    socket.emit("update", { name, color, x, y });

    return () => {
      socket.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("floorData", ({ avatars }) => setAvatars(avatars));
  }, [avatars]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ArrowUp | wKey && y > 0) {
        setY(y - 1);
      }
      if (ArrowDown | sKey && y < 660) {
        setY(y + 1);
      }
      if (ArrowRight | dKey && x < 760) {
        setX(x + 1);
      }
      if (ArrowLeft | aKey && x > 0) {
        setX(x - 1);
      }
    }, 1);
    if (name !== "" || color !== "") {
      socket.emit("update", { name, color, x, y });
    }
    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ArrowUp, ArrowDown, ArrowRight, ArrowLeft, wKey, aKey, sKey, dKey, x, y]);

  return (
    <div className="outerContainer">
      <div className="container"></div>
      {avatars.map((avatar, i) => (
        <div
          key={i}
          className="Avatar"
          style={{
            background: avatar.color,
            left: avatar.x + windowDimensions[0],
            top: avatar.y + windowDimensions[1],
          }}
        >
          {avatar.name.charAt(0).toUpperCase()}
        </div>
      ))}
    </div>
  );
};

//Key Press Hook
function useKeyPress(targetKey) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is target key then set to true
  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  // If released key is trget key then set to false
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return keyPressed;
}

//Window Resize Hook
function useWindowResize() {
  // MaxWidth equals to the office Width minus Avatar Diameter
  const [maxWindwoWidth, setMaxWindowWidth] = useState(
    (window.innerWidth - 800) / 2
  );

  //MaxHeight equals to the office height minus avatar diameter
  const [maxWindowHeight, setMaxWindowHeight] = useState(
    (window.innerHeight - 700) / 2
  );

  //Changes MaxWidth / MaxHeight on Windowresize
  function ResizeHandler() {
    setMaxWindowWidth((window.innerWidth - 800) / 2);
    setMaxWindowHeight((window.innerHeight - 700) / 2);
  }
  useEffect(() => {
    window.addEventListener("resize", ResizeHandler);
    return () => {
      window.removeEventListener("resize", ResizeHandler);
    };
  }, []);

  return [maxWindwoWidth, maxWindowHeight];
}

export default Floor;
