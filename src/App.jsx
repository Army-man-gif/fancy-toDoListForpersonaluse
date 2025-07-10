import "./App_replacedcss.css";
import Form from "./Form.jsx";
import Buttons from "./Buttons.jsx";
import Task from "./Task.jsx";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";

function App() {
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

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
    const newValue = { id: `todo-${nanoid()}`, name: name, isChecked: false };
    setValues([...currentVal, newValue]);
    count++;
  }
  const values = [
    { id: "todo-0", name: "Eat", isChecked: true },
    { id: "todo-1", name: "Sleep", isChecked: false },
    { id: "todo-2", name: "Repeat", isChecked: false },
  ];

  const [currentVal, setValues] = useState(values);
  let count = currentVal.length;
  let countNoun = "tasks";
  const [filter, setFilter] = useState("All");
  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.isChecked,
    Completed: (task) => task.isChecked,
  };
  const FILTER_NAMES = Object.keys(FILTER_MAP);
  const filterList = FILTER_NAMES.map((name) => (
    <Buttons
      key={name}
      val={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
  const filteredEls = currentVal.filter(FILTER_MAP[filter]);
  count = filteredEls.length;
  if (count == 1) {
    countNoun = "task";
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
        {count} {countNoun} remaining
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
