const TaskStats = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>Total Tasks</h3>
        <p>{totalTasks}</p>
      </div>
      <div className="stat-card">
        <h3>Completed</h3>
        <p>{completedTasks}</p>
      </div>
      <div className="stat-card">
        <h3>Active</h3>
        <p>{activeTasks}</p>
      </div>
      <div className="stat-card">
        <h3>High Priority</h3>
        <p>{highPriorityTasks}</p>
      </div>
    </div>
  );
};

export default TaskStats;