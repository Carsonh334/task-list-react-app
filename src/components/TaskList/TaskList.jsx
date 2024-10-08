import React, { useState, useEffect } from "react";
import "./TaskList.css";

const TaskCard = ({ task, onClose, onToggleCompletion, onDelete }) => (
  <div className="task-card">
    <h2>{task.title}</h2>
    <p>{task.description}</p>
    <p>Due: {task.dueDate}</p>
    <label>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleCompletion(task.id)}
      />
      Completed
    </label>
    <button onClick={() => onDelete(task.id)}>Delete</button>
    <button onClick={onClose}>Close</button>
  </div>
);

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    completed: false,
  });
  const [currentView, setCurrentView] = useState("todo");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.title.trim() !== "") {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setNewTask({ title: "", description: "", dueDate: "", complete: false });
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask(null);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    currentView === "todo" ? !task.completed : task.completed
  );

  const exportTasks = () => {
    const dataStr =
      "data:text/json;chatset=utf-8," +
      encodeURIComponent(JSON.stringify(tasks));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tasks.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCheckboxChange = (e, taskId) => {
    e.stopPropagation();
    toggleTaskCompletion(taskId);
  };

  return (
    <div className="task-list">
      <h1>Task List</h1>
      <div className="view-buttons">
        <button
          onClick={() => setCurrentView("todo")}
          className={currentView === "todo" ? "active" : ""}
        >
          Todo
        </button>
        <button
          onClick={() => setCurrentView("completed")}
          className={currentView === "completed" ? "active" : ""}
        >
          Completed
        </button>
      </div>
      <div className="add-task">
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} onClick={() => handleTaskClick(task)}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => {
                handleCheckboxChange(e, task.id);
              }}
            />
            <span>{task.title}</span>
            <span>{task.dueDate}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button onClick={exportTasks}>Export Tasks</button>
      {selectedTask && (
        <TaskCard
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onToggleCompletion={toggleTaskCompletion}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
};

export default TaskList;
