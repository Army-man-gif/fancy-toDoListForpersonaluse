import "./App_replacedcss.css";
import Form from "./Form.jsx";
import Buttons from "./Buttons.jsx";
import Task from "./Task.jsx";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";

function App() {
  function editTask(id, newName) {
    const editedTasks = currentVal.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setValues(editedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = currentVal.filter((task) => id !== task.id);
    count--;
    setValues(remainingTasks);
  }
  function toggleTaskCompleted(id) {
    const updatedTasks = currentVal.map((task) => {
      if (id === task.id) {
        return { ...task, isChecked: !task.isChecked };
      }
      return task;
    });
    setValues(updatedTasks);
  }
  function addTask(name) {
    if (name != "") {
      const newValue = { id: `todo-${nanoid()}`, name: name, isChecked: false };
      setValues([...currentVal, newValue]);
      count++;
    } else {
      alert("You must enter a task");
    }
  }
  const [currentVal, setValues] = useState(() => {
    const savedTasks = localStorage.getItem("Tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("Tasks", JSON.stringify(currentVal));
  }, [currentVal]);

  let count = currentVal.length;
  let countNoun = "tasks";
  const [filter, setFilter] = useState("All");

  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.isChecked,
    Completed: (task) => task.isChecked,
    Clear_Storage: () => true,
  };
  const FILTER_NAMES = Object.keys(FILTER_MAP);
  const filterList = FILTER_NAMES.map((name) => (
    <Buttons
      key={name}
      val={name}
      isPressed={name === filter}
      setFilter={setFilter}
      setValues={setValues}
    />
  ));

  const filteredEls = currentVal.filter(FILTER_MAP[filter]);
  count = filteredEls.length;
  if (count == 1) {
    countNoun = "task";
  }
  let empty = false;
  if (count == 0) {
    empty = true;
  }

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

  return (
    <div className="todoapp stack-la  rge">
      <h1>TodoMatic</h1>
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
