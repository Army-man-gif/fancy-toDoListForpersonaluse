function decider(val, setFilter, setValues, handleClearStorage) {
  if (val != "Clear_Storage") {
    setFilter(val);
  } else {
    handleClearStorage();
  }
}
function Button({ val, isPressed, setFilter, setValues, handleClearStorage }) {
  return (
    <button
      type="button"
      className="btn toggle-btn"
      aria-pressed={isPressed}
      onClick={() => decider(val, setFilter, setValues, handleClearStorage)}
    >
      <span className="visually-hidden">Show </span>

      <span>{val}</span>

      <span className="visually-hidden">tasks</span>
    </button>
  );
}

export default Button;
