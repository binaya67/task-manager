import { FaFilter, FaSort } from 'react-icons/fa';

const TaskFilter = ({ filter, setFilter, sortBy, setSortBy }) => {
  return (
    <div className="filter-container">
      <div className="filter-group">
        <FaFilter className="filter-icon" />
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter tasks"
          className="filter-select"
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>
      
      <div className="filter-group">
        <FaSort className="sort-icon" />
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort tasks"
          className="sort-select"
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

export default TaskFilter;