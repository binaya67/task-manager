import React from 'react';
import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaTasks, FaTimes, FaPaperclip, FaFile, FaFileImage, FaFilePdf, FaSun, FaMoon, FaPlus } from 'react-icons/fa';
import { FiClock, FiPlay, FiPause, FiSkipForward, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { MdDragIndicator, MdWork, MdFreeBreakfast } from 'react-icons/md';
import './styles/App.css';

// Touch device check
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
};

// Basic components
const Task = ({ task, onDelete, onToggle, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate ? new Date(task.dueDate) : null);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(task.id, editedText, editedPriority, editedDueDate?.toISOString(), task.category);
    setIsEditing(false);
  };

  const getPriorityColor = () => {
    switch(task.priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffd166';
      case 'low': return '#06d6a0';
      default: return '#118ab2';
    }
  };

  return (
    <div className={`task-content ${task.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            autoFocus
            className="edit-input"
          />
          <div className="form-row">
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
              className="priority-select"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <DatePicker
              selected={editedDueDate}
              onChange={(date) => setEditedDueDate(date)}
              dateFormat="MMMM d, yyyy"
              placeholderText="No due date"
              className="date-picker"
              minDate={new Date()}
              popperPlacement="bottom-start"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn save-btn">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-main">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="task-checkbox"
              />
              <span className="checkmark"></span>
            </label>
            <span className="task-text">
              {task.text}
            </span>
            <div className="task-icons">
              <button onClick={() => setIsEditing(true)} className="icon-btn edit-btn">
                <FiEdit2 />
              </button>
              <button onClick={() => onDelete(task.id)} className="icon-btn delete-btn">
                <FiTrash2 />
              </button>
            </div>
          </div>
          <div className="task-meta">
            <span className="priority-badge" style={{ backgroundColor: getPriorityColor() }}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="due-date">
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const TaskStats = ({ tasks }) => {
  const completedCount = tasks.filter(task => task.completed).length;
  const highPriorityCount = tasks.filter(task => task.priority === 'high').length;
  const overdueCount = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
  ).length;

  return (
    <div className="stats-container">
      <div className="stat-item">
        <h3>{tasks.length}</h3>
        <p>Total Tasks</p>
      </div>
      <div className="stat-item">
        <h3>{completedCount}</h3>
        <p>Completed</p>
      </div>
      <div className="stat-item">
        <h3>{highPriorityCount}</h3>
        <p>High Priority</p>
      </div>
      <div className="stat-item">
        <h3>{overdueCount}</h3>
        <p>Overdue</p>
      </div>
    </div>
  );
};

const AddTask = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Task text cannot be empty');
      return;
    }
    onAdd(text, priority, dueDate?.toISOString(), 'general');
    setText('');
    setPriority('medium');
    setDueDate(null);
    setIsExpanded(false);
  };

  return (
    <div className={`add-task-container ${isExpanded ? 'expanded' : ''}`}>
      {!isExpanded ? (
        <button className="add-task-toggle" onClick={() => setIsExpanded(true)}>
          <FaPlus /> Add Task
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="add-task-form">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="task-input"
            autoFocus
          />
          <div className="form-controls">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              dateFormat="MMMM d, yyyy"
              placeholderText="Due date"
              className="date-picker"
              minDate={new Date()}
              popperPlacement="bottom-start"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn primary-btn">Add Task</button>
            <button type="button" onClick={() => setIsExpanded(false)} className="btn secondary-btn">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const TaskFilter = ({ filter, setFilter, sortBy, setSortBy }) => {
  return (
    <div className="filter-container">
      <div className="filter-group">
        <label>Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="default">Default</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
};

const ThemeToggle = ({ darkMode, toggleTheme }) => {
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <FaTasks /> TaskFlow
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/" exact activeClassName="active">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/explore" activeClassName="active">
              Explore
            </NavLink>
          </li>
          <li>
            <NavLink to="/hire" activeClassName="active">
              Hire
            </NavLink>
          </li>
          <li>
            <NavLink to="/jobs" activeClassName="active">
              Jobs
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" activeClassName="active">
              Blog
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// Pomodoro Timer Component
const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'break'
  const [cycles, setCycles] = useState(0);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            clearInterval(interval);
            const newMode = mode === 'work' ? 'break' : 'work';
            setMode(newMode);
            
            if (mode === 'work') {
              setCycles(prev => prev + 1);
              toast.success('Work session completed! Time for a break.');
              setMinutes(breakDuration); // Short break
            } else {
              toast.info('Break time over! Back to work.');
              setMinutes(workDuration); // Work session
            }
            
            setSeconds(0);
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, workDuration, breakDuration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'work' ? workDuration : breakDuration);
    setSeconds(0);
  };

  const skipSession = () => {
    setIsActive(false);
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);
    
    if (newMode === 'work') {
      setMinutes(workDuration);
    } else {
      setMinutes(breakDuration);
    }
    
    setSeconds(0);
  };

  const handleWorkDurationChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 60) {
      setWorkDuration(value);
      if (mode === 'work' && !isActive) {
        setMinutes(value);
      }
    }
  };

  const handleBreakDurationChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 30) {
      setBreakDuration(value);
      if (mode === 'break' && !isActive) {
        setMinutes(value);
      }
    }
  };

  return (
    <div className={`pomodoro-timer ${mode}`}>
      <div className="timer-header">
        {mode === 'work' ? <MdWork className="timer-icon" /> : <MdFreeBreakfast className="timer-icon" />}
        <h3>{mode === 'work' ? 'Focus Time' : 'Break Time'}</h3>
      </div>
      <div className="timer-display">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="timer-controls">
        <button onClick={toggleTimer} className={`timer-btn ${isActive ? 'pause-btn' : 'play-btn'}`}>
          {isActive ? <FiPause /> : <FiPlay />}
        </button>
        <button onClick={resetTimer} className="timer-btn reset-btn">
          <FaTimes />
        </button>
        <button onClick={skipSession} className="timer-btn skip-btn">
          <FiSkipForward />
        </button>
      </div>
      <div className="timer-settings">
        <div className="setting-group">
          <label>Work (min):</label>
          <input
            type="number"
            min="1"
            max="60"
            value={workDuration}
            onChange={handleWorkDurationChange}
            disabled={isActive}
          />
        </div>
        <div className="setting-group">
          <label>Break (min):</label>
          <input
            type="number"
            min="1"
            max="30"
            value={breakDuration}
            onChange={handleBreakDurationChange}
            disabled={isActive}
          />
        </div>
      </div>
      <div className="cycles-counter">
        <span>Completed cycles: {cycles}</span>
      </div>
    </div>
  );
};

// Draggable Task Component
const DraggableTask = ({ task, index, onDelete, onToggle, onEdit, moveTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`task ${isDragging ? 'dragging' : ''}`}
    >
      <MdDragIndicator className="drag-handle" />
      <Task task={task} onDelete={onDelete} onToggle={onToggle} onEdit={onEdit} />
    </div>
  );
};

// Sortable Task List Component
const SortableTaskList = ({ tasks, onDelete, onToggle, onEdit, moveTask }) => {
  return (
    <div className="task-list">
      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <DraggableTask
            key={task.id}
            index={index}
            task={task}
            onDelete={onDelete}
            onToggle={onToggle}
            onEdit={onEdit}
            moveTask={moveTask}
          />
        ))
      ) : (
        <div className="empty-state">
          <img src="https://cdn.dribbble.com/users/148670/screenshots/5240586/media/ae9c6cddc5d4cdd50f30d1aae1a5c841.png" alt="No tasks" />
          <p>No tasks found. Add a new task to get started!</p>
        </div>
      )}
    </div>
  );
};

// Task Manager Component
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    // Check for preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Apply dark mode to body
  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const addTask = (text, priority, dueDate, category) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      priority,
      dueDate,
      category,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    toast.success('Task added successfully!');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.info('Task deleted!');
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id, newText, newPriority, newDueDate, newCategory) => {
    setTasks(
      tasks.map(task =>
        task.id === id
          ? {
              ...task,
              text: newText,
              priority: newPriority,
              dueDate: newDueDate,
              category: newCategory,
            }
          : task
      )
    );
    toast.success('Task updated successfully!');
  };

  const moveTask = (fromIndex, toIndex) => {
    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, movedTask);
    setTasks(newTasks);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    if (['high', 'medium', 'low'].includes(filter)) return task.priority === filter;
    if (filter === 'overdue') return (
      task.dueDate && 
      new Date(task.dueDate) < new Date() && 
      !task.completed
    );
    return true;
  }).filter(task => 
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  return (
    <div className="task-manager">
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />
      
      <div className="container">
        <div className="header">
          <h1>Task Manager</h1>
          <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
        </div>
        
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <TaskStats tasks={tasks} />
        <AddTask onAdd={addTask} />
        <TaskFilter
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        
        <div className="content-wrapper">
          <div className="tasks-section">
            <SortableTaskList
              tasks={sortedTasks}
              onDelete={deleteTask}
              onToggle={toggleTask}
              onEdit={editTask}
              moveTask={moveTask}
            />
          </div>
          
          <div className="pomodoro-section">
            <PomodoroTimer />
          </div>
        </div>
      </div>
    </div>
  );
};

// Page components
const Explore = () => (
  <div className="page">
    <h2>Explore Productivity Tools</h2>
    <div className="explore-grid">
      <div className="explore-card">
        <h3>Time Management</h3>
        <p>Learn techniques to better manage your time and increase productivity.</p>
      </div>
      <div className="explore-card">
        <h3>Task Strategies</h3>
        <p>Discover different approaches to task management that suit your style.</p>
      </div>
      <div className="explore-card">
        <h3>Focus Techniques</h3>
        <p>Explore methods to improve concentration and minimize distractions.</p>
      </div>
    </div>
  </div>
);

const Hire = () => (
  <div className="page">
    <h2>Hire Productivity Experts</h2>
    <p>Connect with professionals who can help optimize your workflow and productivity.</p>
  </div>
);

const Jobs = () => (
  <div className="page">
    <h2>Productivity Jobs</h2>
    <p>Find opportunities to work in productivity-focused roles and help others achieve more.</p>
  </div>
);

const Blog = () => (
  <div className="page">
    <h2>Productivity Blog</h2>
    <div className="blog-posts">
      <article className="blog-post">
        <h3>5 Ways to Boost Your Daily Productivity</h3>
        <p>Discover simple yet effective techniques to get more done each day.</p>
      </article>
      <article className="blog-post">
        <h3>The Pomodoro Technique Explained</h3>
        <p>Learn how this time management method can revolutionize your work habits.</p>
      </article>
      <article className="blog-post">
        <h3>Task Prioritization Methods Compared</h3>
        <p>Explore different approaches to deciding what to work on first.</p>
      </article>
    </div>
  </div>
);

// App Component
function App() {
  const backend = isTouchDevice() ? TouchBackend : HTML5Backend;

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <DndProvider backend={backend}>
          <main>
            <Routes>
              <Route path="/" element={<TaskManager />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/hire" element={<Hire />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/blog" element={<Blog />} />
            </Routes>
          </main>
        </DndProvider>
      </div>
    </Router>
  );
}

export default App;