import { useState } from 'react';
import { FaTrash, FaCheck, FaEdit, FaCalendarAlt, FaTag, FaPaperclip, FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { FaFileImage, FaFilePdf, FaFile } from 'react-icons/fa';

const getFileIcon = (fileType) => {
  if (fileType.includes('image')) return <FaFileImage />;
  if (fileType.includes('pdf')) return <FaFilePdf />;
  return <FaFile />;
};

const Task = ({ task, onDelete, onToggle, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate ? new Date(task.dueDate) : null);
  const [editedCategory, setEditedCategory] = useState(task.category);
  const [attachments, setAttachments] = useState(task.attachments || []);

  const handleEdit = () => {
    if (!editedText.trim()) {
      toast.error('Task text cannot be empty');
      return;
    }
    onEdit(
      task.id, 
      editedText, 
      editedPriority, 
      editedDueDate ? editedDueDate.toISOString() : '', 
      editedCategory,
      attachments
    );
    setIsEditing(false);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + attachments.length > 3) {
      toast.error('Maximum 3 attachments allowed');
      return;
    }

    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      file
    }));

    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`task ${task.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            autoFocus
            className="form-input"
          />
          
          <div className="form-group">
            <label>Priority</label>
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
              className="form-select"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Due Date</label>
            <DatePicker
              selected={editedDueDate}
              onChange={(date) => setEditedDueDate(date)}
              minDate={new Date()}
              className="form-input"
              placeholderText="Select due date"
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              className="form-select"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
              <option value="study">Study</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Attachments (max 3)</label>
            <input
              type="file"
              onChange={handleFileUpload}
              multiple
              className="form-input"
            />
            <div className="attachment-container">
              {attachments.map(att => (
                <div key={att.id} className="attachment-item">
                  {getFileIcon(att.type)}
                  <span>{att.name}</span>
                  <FaTimes 
                    className="attachment-delete"
                    onClick={() => removeAttachment(att.id)}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="edit-buttons">
            <button onClick={handleEdit} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h3>
            <span className="task-text">{task.text}</span>
            <div className="task-actions">
              <div 
                className="task-icon edit-icon"
                onClick={() => setIsEditing(true)}
                title="Edit task"
              >
                <FaEdit />
              </div>
              <div 
                className="task-icon complete-icon"
                onClick={() => onToggle(task.id)}
                title={task.completed ? 'Mark as incomplete' : 'Complete task'}
              >
                <FaCheck />
              </div>
              <div 
                className="task-icon delete-icon"
                onClick={() => onDelete(task.id)}
                title="Delete task"
              >
                <FaTrash />
              </div>
            </div>
          </h3>
          
          <div className="task-meta">
            <span className={`priority priority-${task.priority}`}>
              {task.priority}
            </span>
            
            {task.dueDate && (
              <span className="task-meta-item">
                <FaCalendarAlt /> {formatDate(task.dueDate)}
              </span>
            )}
            
            <span className={`category category-${task.category}`}>
              <FaTag /> {task.category}
            </span>
          </div>
          
          {task.attachments && task.attachments.length > 0 && (
            <div className="attachment-container">
              {task.attachments.map((att, index) => (
                <div key={index} className="attachment-item">
                  <FaPaperclip /> {att.name}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Task;