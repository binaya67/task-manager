import { render, screen, fireEvent } from '@testing-library/react';
import Task from './Task';

const mockTask = {
  id: 1,
  text: 'Buy groceries',
  completed: false,
  priority: 'medium'
};

describe('Task Component', () => {
  test('renders task text', () => {
    render(<Task task={mockTask} />);
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  test('toggles completion status', () => {
    const mockToggle = jest.fn();
    render(<Task task={mockTask} onToggle={mockToggle} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockToggle).toHaveBeenCalledWith(1);
  });

  test('shows edit form when edit button clicked', () => {
    render(<Task task={mockTask} />);
    fireEvent.click(screen.getByLabelText('Edit task'));
    expect(screen.getByDisplayValue('Buy groceries')).toBeInTheDocument();
  });
});