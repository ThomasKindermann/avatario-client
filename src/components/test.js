import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "../App.css";

// location of server
const ENDPOINT = "localhost:5000";

//empty socket for connection
let socket;

// cors fix ? not good solution
var connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const Test = () => {
  // local number
  const [number, setNumber] = useState("");

  // useEffect on component mount opens socket listeners
  useEffect(() => {
    // connect to socket.io server
    socket = io.connect(ENDPOINT, connectionOptions);

    // listens on "mutated"-channel of the number on the server and saves into local variable
    socket.on("mutated", (testNumber) => {
      setNumber(testNumber);
    });
  }, []);

  // mutation function for buttons
  function mutate(factor) {
    // emit mutating factor for number on serve via "mutate"-channel
    socket.emit("mutate", factor);
  }

  return (
    <div>
      <h1>{number}</h1>
      <button onClick={() => mutate(-1)}>dec</button>
      <button onClick={() => mutate(1)}>inc</button>
    </div>
  );
};

export default Test;
