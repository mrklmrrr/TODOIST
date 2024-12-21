import React from "react";
import { v4 as uuidv4 } from "uuid";
import styles from './App.module.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      value: "",
      description: "",
      severity: "medium",
      todos: [],
      showDone: true,
      search: "",
      severityFilter: "all",
    };
  }

  handleInputChange = (e) => {
    this.setState({ value: e.target.value });
  };

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value });
  };

  handleSeverityChange = (e) => {
    this.setState({ severity: e.target.value });
  };

  handleTodoAdd = () => {
    const { value, description, severity } = this.state;
    if (this.isValidTaskName(value)) {
      this.setState((prevState) => ({
        value: "",
        description: "",
        todos: [
          ...prevState.todos,
          {
            id: uuidv4(),
            title: value.trim(),
            description: description.trim(),
            done: false,
            severity: severity,
            createdAt: new Date().toLocaleString(),
          },
        ],
      }));
    }
  };

  isValidTaskName(name) {
    return name.trim() !== "";
  }

  generateTasks = (count) => {
    const newTasks = Array.from({ length: count }, (_, i) => ({
      id: uuidv4(),
      title: `Task ${i + 1}`,
      description: `Description for task ${i + 1}`,
      done: false,
      severity: this.state.severity,
      createdAt: new Date().toLocaleString(),
    }));

    this.setState((prevState) => ({
      todos: [...prevState.todos, ...newTasks],
    }));
  };

  handleToggleShowDone = () => {
    this.setState((prevState) => ({ showDone: !prevState.showDone }));
  };

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value });
  };

  handleSeverityFilterChange = (e) => {
    this.setState({ severityFilter: e.target.value });
  };

  toggleTodoDone = (id) => {
    this.setState((prevState) => ({
      todos: prevState.todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      ),
    }));
  };

  render() {
    const { todos, showDone, search, severity, value, description, severityFilter } = this.state;

    const filteredTodos = todos.filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        todo.description.toLowerCase().includes(search.toLowerCase());
      const matchesDone = showDone || !todo.done;
      const matchesSeverity = severityFilter === "all" || todo.severity === severityFilter;

      return matchesSearch && matchesDone && matchesSeverity;
    });

    return (
      <div className={styles.appContainer}>
        <h1 className={styles.title}>Список задач</h1>

        <div className={styles.searchContainer}>
          <input
            className={styles.input}
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={this.handleSearchChange}
          />
          <div className={styles.filters}>
            <select value={severityFilter} onChange={this.handleSeverityFilterChange}>
              <option value="all">Все</option>
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
          </div>
        </div>

        <div className={styles.checkboxContainer}>
          <label>
            <input
              type="checkbox"
              checked={showDone}
              onChange={this.handleToggleShowDone}
            />
            Показать выполненные задачи
          </label>
        </div>

        <ul className={styles.todoList}>
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <Todo key={todo.id} todo={todo} onToggleDone={this.toggleTodoDone} />
            ))
          ) : (
            <li>По вашим критериям ничего не найдено.</li>
          )}
        </ul>

        <div className={styles.inputContainer}>
          <input
            className={styles.input}
            placeholder="Название задачи"
            value={value}
            onChange={this.handleInputChange}
          />
          <input
            className={styles.input}
            placeholder="Описание задачи"
            value={description}
            onChange={this.handleDescriptionChange}
          />
          <div className={styles.severitySelector}>
            <label>
              <input
                type="radio"
                value="low"
                checked={severity === "low"}
                onChange={this.handleSeverityChange}
              />
              Low
            </label>
            <label>
              <input
                type="radio"
                value="medium"
                checked={severity === "medium"}
                onChange={this.handleSeverityChange}
              />
              Medium
            </label>
            <label>
              <input
                type="radio"
                value="high"
                checked={severity === "high"}
                onChange={this.handleSeverityChange}
              />
              High
            </label>
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.addButton} onClick={this.handleTodoAdd}>Добавить задачу</button>
            <button className={styles.generateButton} onClick={() => this.generateTasks(1000)}>Сгенерировать 1000 задач</button>
          </div>
        </div>
      </div>
    );
  }
}

class Todo extends React.Component {
  render() {
    const { todo, onToggleDone } = this.props;
    return (
      <li className={styles.todoItem} style={{ color: todo.done ? "grey" : "black" }}>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggleDone(todo.id)}
        />
        <strong>{todo.title}</strong>: {todo.description} (Важность: {todo.severity}) 
        <span className={styles.todoDate}> (Добавлено: {todo.createdAt})</span>
      </li>
    );
  }
}

export default App;