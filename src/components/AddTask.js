import { useState, useRef } from 'react';
import { FaPlus, FaPaperclip } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

const AddTask = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(null);
  const [category, setCategory] = useState('work');
  const [showForm, setShowForm] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Task text cannot be empty');
      return;
    }
    
    onAdd(
      text, 
      priority, 
      dueDate ? dueDate.toISOString() : '', 
      category,
      attachments
    );
    
    setText('');
    setPriority('medium');
    setDueDate(null);
    setCategory('work');
    setAttachments([]);
    setShowForm(false);
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

  return (
    <div className="add-task-form">
      {showForm ? (
        <form onSubmit={handleSubmit}>
          <h2>Add New Task</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="task-text">Task Description</label>
              <input
                id="task-text"
                type="text"
                placeholder="What needs to be done?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="task-due-date">Due Date (optional)</label>
              <DatePicker
                id="task-due-date"
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                minDate={new Date()}
                placeholderText="Select a date"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="task-category">Category</label>
              <select
                id="task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health</option>
                <option value="study">Study</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="task-attachments">Attachments (max 3)</label>
              <div 
                className="attachment-upload"
                onClick={() => fileInputRef.current.click()}
              >
                <FaPaperclip /> Click to add files
                <input
                  id="task-attachments"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  style={{ display: 'none' }}
                />
              </div>
              <div className="attachment-container">
                {attachments.map(att => (
                  <div key={att.id} className="attachment-item">
                    <FaPaperclip /> {att.name}
                    <button 
                      type="button"
                      className="attachment-delete"
                      onClick={() => removeAttachment(att.id)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <button type="submit" className="add-task-btn">
            <FaPlus /> Add Task
          </button>
        </form>
      ) : (
        <button 
          className="add-task-btn" 
          onClick={() => setShowForm(true)}
        >
          <FaPlus /> Add New Task
        </button>
      )}
    </div>
  );
};

export default AddTask;