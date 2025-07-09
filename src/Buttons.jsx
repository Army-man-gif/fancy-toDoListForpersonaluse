function Button({ val, isPressed, setFilter }) {
  return (
    <button
      type="button"
      className="btn toggle-btn"
      aria-pressed={isPressed}
      onClick={() => setFilter(val)}
    >
      <span className="visually-hidden">Show </span>

      <span>{val}</span>

      <span className="visually-hidden">tasks</span>
    </button>
  );
}

export default Button;
