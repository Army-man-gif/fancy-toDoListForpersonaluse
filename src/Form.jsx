import { useState } from "react";

function Form({ id, type, addTask }) {
  const [name, setName] = useState("");

  function handleChange(event) {
    setName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    addTask(name);
    setName("");
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="label-wrapper">
          <label htmlFor={id} className="label__lg">
            What needs to be done?
          </label>
        </h2>
        <input
          type={type}
          id={id}
          className="input input__lg"
          name="text"
          autoComplete="off"
          value={name}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn__primary btn__lg">
          Add
        </button>
      </form>
    </>
  );
}

export default Form;
