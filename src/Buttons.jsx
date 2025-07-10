function clear() {
  localStorage.clear();
}
function decider(val, setFilter, setValues) {
  if (val != "Clear_Storage") {
    setFilter(val);
  } else {
    clear();
    setValues([]);
  }
}
function Button({ val, isPressed, setFilter, setValues }) {
  return (
    <button
      type="button"
      className="btn toggle-btn"
      aria-pressed={isPressed}
      onClick={() => decider(val, setFilter, setValues)}
    >
      <span className="visually-hidden">Show </span>

      <span>{val}</span>

      <span className="visually-hidden">tasks</span>
    </button>
  );
}

export default Button;
