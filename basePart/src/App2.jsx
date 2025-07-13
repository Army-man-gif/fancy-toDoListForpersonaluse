import "./App_replacedcss.css";
import Form from "./Form.jsx";
import Buttons from "./Buttons.jsx";
import Task from "./Task.jsx";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import {
  getData,
  addData,
  clean,
  updateData,
  cleanAll,
} from "./testingDatabase.js";
function App() {
  // Setting up the data saving logic and data storage logic
  const [title, setTitle] = useState(() => prompt("Enter your name"));
  const [syncStatus, setSyncStatus] = useState(false);
  const [count, setCount] = useState(0);
  const [currentVal, setValues] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  async function fetchData() {
    const savedTasks = await getData(title);
    try {
      if (savedTasks) {
        setValues(savedTasks);
      } else {
        setValues([]);
      }
      setIsDataFetched(true);
    } catch (error) {
      console.error("Failed to fetch data", error);
      setSyncStatus(false);
      setIsDataFetched(false);
    }
  }
  useEffect(() => {
    if (title) {
      fetchData().catch((error) => {
        console.error("Failed to fetch data", error);
        setSyncStatus(false);
      });
    }
  }, [title]);
  async function updateFireStore() {
    const currentTasks = await getData(title);
    const currentTasksIds = currentTasks.map((task) => task.id);
    const localTasksIds = currentVal.map((task) => task.id);
    for (const task of currentVal) {
      if (currentTasksIds.includes(task.id)) {
        const matchedTask = currentTasks.find((t) => t.id === task.id);
        if (
          matchedTask.name != task.name ||
          matchedTask.isChecked != task.isChecked
        ) {
          await updateData(
            task.id,
            {
              name: task.name,
              isChecked: task.isChecked,
            },
            title,
          );
        }
      } else {
        await addData(title, task.id, {
          name: task.name,
          isChecked: task.isChecked,
        });
      }
    }
    for (const task of currentTasks) {
      if (!localTasksIds.includes(task.id)) {
        await clean(title, task.id);
      }
    }
    setSyncStatus(true);
  }
  function overrideLocalStorage() {
    localStorage.setItem("Tasks", JSON.stringify(currentVal));
  }
  useEffect(() => {
    if (isDataFetched) {
      overrideLocalStorage();
    }
  }, [currentVal, title, isDataFetched]);

  // Clearing storage logic
  const [storageCleared, setStorageCleared] = useState(false);
  async function handleClearStorage() {
    const admin = prompt("Enter secret admin password");
    if (admin !== "1234") {
      alert("You don't have permission to clear the local storage");
    } else {
      try {
        await cleanAll(title);
        setValues([]);
        setStorageCleared(true);
      } catch (error) {
        console.error("Failed to clear Firestore:", error);
        setSyncStatus(false);
      }
    }
  }

  useEffect(() => {
    if (storageCleared) {
      setTimeout(() => {
        setSyncStatus(true);
        setStorageCleared(false);
      }, 300);
    }
  }, [storageCleared]);

  /*
---------------------------------------------------------------------------
Below here is identical

*/
  // Edit tasks
  function editTask(id, newName) {
    const editedTasks = currentVal.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setValues(editedTasks);
  }

  // Delete tasks
  function deleteTask(id) {
    const remainingTasks = currentVal.filter((task) => id !== task.id);
    setValues(remainingTasks);
  }

  // Add tasks
  function addTask(name) {
    if (name != "") {
      const newValue = { id: `todo-${nanoid()}`, name: name, isChecked: false };
      setValues([...currentVal, newValue]);
    } else {
      alert("You must enter a task");
    }
  }
  // Tasks completed logic
  const [showConfetti, setShowConfetti] = useState(false);

  function toggleTaskCompleted(id) {
    let confetti = true;
    const updatedTasks = currentVal.map((task) => {
      if (id === task.id) {
        if (task.isChecked == true) {
          confetti = false;
        }
        return { ...task, isChecked: !task.isChecked };
      }
      return task;
    });
    if (confetti) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
    setValues(updatedTasks);
  }

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000); // confetti for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // App filtering tasks logic

  let countNoun = "tasks";

  // Set up the different filters
  const [filter, setFilter] = useState("All");
  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.isChecked,
    Completed: (task) => task.isChecked,
    Clear_Storage: () => true,
  };
  const FILTER_NAMES = Object.keys(FILTER_MAP);

  // Making the filter buttons
  const filterList = FILTER_NAMES.map((name) => (
    <Buttons
      key={name}
      val={name}
      isPressed={name === filter}
      setFilter={setFilter}
      setValues={setValues}
      handleClearStorage={handleClearStorage}
    />
  ));
  const filteredEls = currentVal.filter(FILTER_MAP[filter]);
  useEffect(() => {
    setCount(filteredEls.length);
  }, [filteredEls.length]);
  // Filter tasks based on chosen filter

  // Recalculate number of tasks and adjust the naming conventions based on it
  if (count == 1) {
    countNoun = "task";
  }
  let empty = false;
  if (count == 0) {
    empty = true;
  }

  /* 
  Simple refocus logic. Just refocus the input field 
  when the user clicks on the task list
  */
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(count);
  useEffect(() => {
    if (count < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [count, prevTaskLength]);
  function viewStatus() {
    alert("Synced: " + syncStatus);
  }
  function pull() {
    if (!isDataFetched) return;

    const waiter = setTimeout(() => {
      updateFireStore().catch((error) => {
        console.log("Error " + error);
        setSyncStatus(false);
      });
    }, 1000);
    return () => {
      clearTimeout(waiter);
    };
  }
  // Renders everything using all the logic functions above and in other files
  return (
    <div className="todoapp stack-la  rge">
      <h1>Personal To Do list</h1>
      <button type="button" onClick={pull} className="btn btn__change">
        Click to sync to database
      </button>
      {showConfetti && (
        <div id="confetti">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={800}
            gravity={0.95}
          />
        </div>
      )}
      <Form id="new-todo-input" type="text" addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {!empty ? (
          <>
            {count} {countNoun} remaining
          </>
        ) : (
          <>No tasks remaining</>
        )}
      </h2>

      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {filteredEls.map((task) => (
          <li key={task.id} className="todo stack-small">
            <Task
              id={task.id}
              name={task.name}
              isChecked={task.isChecked}
              toggleTaskCompleted={toggleTaskCompleted}
              deleteTask={deleteTask}
              editTask={editTask}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
