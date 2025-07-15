import { useEffect, useRef, useState } from "react";

function Task({
  name,
  id,
  myDay,
  isChecked,
  toggleTaskCompleted,
  deleteTask,
  editTask,
  detectHyperlink,
  toggleTomyDay,
  isStarred,
  toggleStarred,
}) {
  const editFieldRef = useRef(null);
  const DeleteButton = useRef(false);
  const editButtonRef = useRef(false);
  const myDayButton = useRef(false);
  const StarredButton = useRef(false);
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
                {hyperlinkData.alias}
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

        {myDay ? (
          <button
            ref={myDayButton}
            type="button"
            className="btn btn__danger"
            onClick={() => toggleTomyDay(id)}
            disabled={isChecked}
          >
            Remove from myDay <span className="visually-hidden">{newName}</span>
          </button>
        ) : (
          <button
            ref={myDayButton}
            type="button"
            className="btn btn__danger"
            onClick={() => toggleTomyDay(id)}
            disabled={isChecked}
          >
            Add to myDay <span className="visually-hidden">{newName}</span>
          </button>
        )}
        <button
          type="button"
          ref={StarredButton}
          className="btn star"
          onClick={() => toggleStarred(id)}
          aria-label="star-button"
          disabled={isChecked}
        >
          {isStarred ? "★" : "✧"}
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
    if (myDayButton.current && myDayButton.current.disabled) {
      myDayButton.current.className = "btn__disabled";
    }
    if (StarredButton.current && StarredButton.current.disabled) {
      StarredButton.current.className = "btn star_disabled";
    }
    if (StarredButton.current && !StarredButton.current.disabled) {
      if (isStarred) {
        StarredButton.current.className = "btn star_checked";
      } else {
        StarredButton.current.className = "btn star";
      }
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
