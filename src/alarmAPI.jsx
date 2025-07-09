import { useEffect } from "react";

function Alarm() {
  useEffect(() => {
    const output = document.querySelector("#output");
    const button = document.querySelector("#set-alarm");
    const name = document.querySelector("#name");
    const delay = document.querySelector("#delay");
    name.value = "";
    delay.value = "";
    function setAlarm(person, delay) {
      return new Promise((resolve, reject) => {
        if (delay < 0) {
          reject(new Error("Alarm delay must not be negative"));
          return;
        }
        setTimeout(() => {
          resolve(`Wake up, ${person}!`);
        }, delay);
      });
    }

    button.addEventListener("click", () => {
      const delayNum = Number(delay.value);
      setAlarm(name.value, delayNum)
        .then((message) => {
          output.textContent = message;
          name.value = "";
          delay.value = "";
        })
        .catch((error) => {
          output.textContent = `Couldn't set alarm: ${error}`;
          name.value = "";
          delay.value = "";
        });
    });
  }, []);
  return (
    <>
      <input type="text" id="name" placeholder="Enter name" />
      <input type="number" id="delay" placeholder="Enter delay" />
      <button id="set-alarm">Set alarm</button>
      <div id="output"></div>
    </>
  );
}

export default Alarm;
