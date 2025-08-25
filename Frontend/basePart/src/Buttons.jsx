function decider(val, setFilter, handleClearStorage) {
  if (val != "Clear_Storage") {
    setFilter(val);
  } else {
    handleClearStorage();
  }
}
function Button({ val, isPressed, setFilter, handleClearStorage }) {
  return (
    <button
      type="button"
      id={val == "Clear_Storage" ? "clear" : undefined}
      className="btn toggle-btn"
      aria-pressed={isPressed}
      onClick={() => decider(val, setFilter, handleClearStorage)}
    >
      <span className="visually-hidden">Show </span>

      <span>{val}</span>

      <span className="visually-hidden">tasks</span>
    </button>
  );
}

export default Button;
