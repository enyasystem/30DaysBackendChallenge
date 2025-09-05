require 'json'

TODO_FILE = 'todos.json'

def load_todos
  File.exist?(TODO_FILE) ? JSON.parse(File.read(TODO_FILE)) : []
end

def save_todos(todos)
  File.write(TODO_FILE, JSON.pretty_generate(todos))
end

def list_todos(todos)
  puts "Your Todos:"
  todos.each_with_index do |todo, i|
    status = todo['done'] ? '[x]' : '[ ]'
    puts "#{i + 1}. #{status} #{todo['task']}"
  end
end

def add_todo(todos, task)
  todos << { 'task' => task, 'done' => false }
  save_todos(todos)
  puts "Added: #{task}"
end

def complete_todo(todos, index)
  if todos[index]
    todos[index]['done'] = true
    save_todos(todos)
    puts "Completed: #{todos[index]['task']}"
  else
    puts "No such todo."
  end
end

def delete_todo(todos, index)
  if todos[index]
    removed = todos.delete_at(index)
    save_todos(todos)
    puts "Deleted: #{removed['task']}"
  else
    puts "No such todo."
  end
end

todos = load_todos
command = ARGV[0]

case command
when 'add'
  add_todo(todos, ARGV[1..].join(' '))
when 'list'
  list_todos(todos)
when 'complete'
  complete_todo(todos, ARGV[1].to_i - 1)
when 'delete'
  delete_todo(todos, ARGV[1].to_i - 1)
else
  puts "Usage:"
  puts "  ruby todo.rb add \"Task description\""
  puts "  ruby todo.rb list"
  puts "  ruby todo.rb complete <number>"
  puts "  ruby todo.rb delete <number>"
end
