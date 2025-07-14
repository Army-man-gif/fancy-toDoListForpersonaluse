import { useEffect, useRef, useState } from "react";

function Task({
  name,
  id,
  isChecked,
  toggleTaskCompleted,
  deleteTask,
  editTask,
  detectHyperlink,
}) {
  const editFieldRef = useRef(null);
  const DeleteButton = useRef(false);
  const editButtonRef = useRef(false);
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  function handleSubmit(e) {
    e.preventDefault();
    editTask(id, newName);
    setEditing(false);
  }
  function handleChange(e) {
    setNewName(e.target.value);
  }
  const hyperlinkData = detectHyperlink(newName);
  const editTemplate = (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          id={`edit-${id}`}
          type="text"
          value={newName}
          key={id}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="btn-group">
        <button type="button" className="btn" onClick={() => setEditing(false)}>
          Cancel <span className="visually-hidden">renaming {newName}</span>
        </button>
        <button type="submit" className="btn btn__danger">
          Save <span className="visually-hidden">renaming {newName}</span>
        </button>
      </div>
    </form>
  );
  const viewTemplate = (
    <>
      <div className="c-cb">
        <input
          id={`view-${id}`}
          type="checkbox"
          checked={isChecked}
          onChange={() => toggleTaskCompleted(id)}
        />
        <label className="todo-label" htmlFor={`view-${id}`}>
          {hyperlinkData ? (
            <>
              {hyperlinkData.text + " "}
              <a
                href={hyperlinkData.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Link
              </a>
            </>
          ) : (
            newName
          )}
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => setEditing(true)}
          ref={editButtonRef}
          disabled={isChecked}
        >
          Edit <span className="visually-hidden">{newName}</span>
        </button>
        <button
          ref={DeleteButton}
          type="button"
          className="btn btn__danger"
          onClick={() => deleteTask(id)}
          disabled={isChecked}
        >
          Delete <span className="visually-hidden">{newName}</span>
        </button>
      </div>
    </>
  );

  useEffect(() => {
    if (DeleteButton.current && DeleteButton.current.disabled) {
      DeleteButton.current.className = "btn__disabled";
    }

    if (editButtonRef.current && editButtonRef.current.disabled) {
      editButtonRef.current.className = "btn__disabled";
    }
  }, [isChecked]);

  const wasEditing = usePrevious(isEditing);
  useEffect(() => {
    if (!wasEditing && isEditing) {
      editFieldRef.current.focus();
    } else if (wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);

  return <>{isEditing ? editTemplate : viewTemplate}</>;
}

export default Task;
