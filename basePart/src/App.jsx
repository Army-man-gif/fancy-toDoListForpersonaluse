import "./App_replacedcss.css";
import Form from "./Form.jsx";
import Buttons from "./Buttons.jsx";
import Task from "./Task.jsx";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  // Setting up the data saving logic and data storage logic
  const [currentVal, setValues] = useState(() => {
    const savedTasks = localStorage.getItem("Tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("Tasks", JSON.stringify(currentVal));
  }, [currentVal]);

  // Clearing storage logic
  const [storageCleared, setStorageCleared] = useState(false);
  function handleClearStorage() {
    const admin = prompt("Enter secret admin password");
    if (admin !== "1234") {
      alert("You don't have permission to clear the local storage");
    } else {
      localStorage.clear();
      setValues([]);
      setStorageCleared(true);
    }
  }

  useEffect(() => {
    if (storageCleared) {
      setTimeout(() => {
        alert("Local storage cleared");
        setStorageCleared(false);
      }, 500);
    }
  }, [storageCleared]);

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
    count--;
    setValues(remainingTasks);
  }

  // Add tasks
  function addTask(name) {
    if (name != "") {
      const newValue = { id: `todo-${nanoid()}`, name: name, isChecked: false };
      setValues([...currentVal, newValue]);
      count++;
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
    console.log("Confetti triggered?", showConfetti);
    setValues(updatedTasks);
  }

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000); // confetti for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // App filtering tasks logic

  let count = currentVal.length;
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

  // Filter tasks based on chosen filter
  const filteredEls = currentVal.filter(FILTER_MAP[filter]);

  // Recalculate number of tasks and adjust the naming conventions based on it
  count = filteredEls.length;
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

  // Renders everything using all the logic functions above and in other files
  return (
    <div className="todoapp stack-la  rge">
      <h1>TodoMatic</h1>
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
