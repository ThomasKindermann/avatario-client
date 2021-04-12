import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "../App.css";

// location of server
const ENDPOINT = "https://avatario-test.herokuapp.com/";
//const ENDPOINT = "localhost:5000";

//empty socket for connection
let socket;

const Floor = ({ location }) => {
  // Calling window resize hook
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

  // avatar List for render
  const [avatars, setAvatars] = useState([]);
  // user name and color
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  // user Avatar Position
  const [x, setX] = useState(Math.floor(Math.random() * 76) * 10);
  const [y, setY] = useState(Math.floor(Math.random() * 66) * 10);

  // cors fix ? not good solution
  var connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  const [delay, setDelay] = React.useState(false);

  useEffect(() => {
    // parse name and color from URL
    const { name, color } = queryString.parse(location.search);
    setName(name);
    setColor(color);
    // connect to socket
    socket = io.connect(ENDPOINT, connectionOptions);
    // add Avatar to server list
    socket.emit("join", { name, color, x, y });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect on component mount
  useEffect(() => {
    // listen for Avatarlist from server
    socket.on("floorData", ({ avatars }) => {
      console.log("floorDatabefore:", avatars.length);
      setAvatars(avatars);
      console.log("floorData:", avatars.length);
    });

    // listen for position Update of Avatars
    socket.on("updateFloor", ({ updatedAvatar }) => {
      setTimeout(() => {
        setDelay(true);
      }, 1);
      if (delay) {
        // console.log("updateFloor:", avatars.length);
        // console.log(updatedAvatar.x, updatedAvatar.y, updatedAvatar.id);
        if (updatedAvatar) {
          const updatedAvatars = avatars.map((avatar) => {
            if (
              avatar.name === updatedAvatar.name &&
              avatar.color === updatedAvatar.color
            ) {
              avatar.x = updatedAvatar.x;
              avatar.y = updatedAvatar.y;
            }
            return avatar;
          });
          setAvatars(updatedAvatars);
        }
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  useEffect(() => {});

  // user Avatar Movement
  useEffect(() => {
    const interval = setInterval(() => {
      if (ArrowUp | wKey && y > 0) {
        setY(y - 10);
      }
      if (ArrowDown | sKey && y < 660) {
        setY(y + 10);
      }
      if (ArrowRight | dKey && x < 760) {
        setX(x + 10);
      }
      if (ArrowLeft | aKey && x > 0) {
        setX(x - 10);
      }
    }, 20);

    // update position to server
    if (name !== "" && color !== "") {
      socket.emit("update", { x, y });
      console.log("update:", avatars.length);
    }

    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ArrowUp, ArrowDown, ArrowRight, ArrowLeft, wKey, aKey, sKey, dKey, x, y]);

  return (
    <div className="outerContainer">
      <div className="container"></div>
      {avatars.map((avatar) => (
        <div
          key={avatar.id}
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
