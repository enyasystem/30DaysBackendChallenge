require 'sinatra'
require 'json'

TODO_FILE = 'todos.json'

# Load todos from JSON file
def load_todos
  File.exist?(TODO_FILE) ? JSON.parse(File.read(TODO_FILE)) : []
end

# Save todos to JSON file
def save_todos(todos)
  File.write(TODO_FILE, JSON.pretty_generate(todos))
end

get '/' do
  @todos = load_todos
  erb :index
end

post '/add' do
  todos = load_todos
  task = params['task']
  todos << { 'task' => task, 'done' => false } unless task.strip.empty?
  save_todos(todos)
  redirect '/'
end

post '/complete/:id' do
  todos = load_todos
  idx = params['id'].to_i
  todos[idx]['done'] = true if todos[idx]
  save_todos(todos)
  redirect '/'
end

post '/delete/:id' do
  todos = load_todos
  idx = params['id'].to_i
  todos.delete_at(idx) if todos[idx]
  save_todos(todos)
  redirect '/'
end
