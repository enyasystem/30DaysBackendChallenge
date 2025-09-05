require 'tk'
require 'json'

TODO_FILE = 'todos.json'

def load_todos
  File.exist?(TODO_FILE) ? JSON.parse(File.read(TODO_FILE)) : []
end

def save_todos(todos)
  File.write(TODO_FILE, JSON.pretty_generate(todos))
end

todos = load_todos

root = TkRoot.new { title "Ruby Todo List" }
listbox = TkListbox.new(root) { width 40; height 10 }.pack
entry = TkEntry.new(root) { width 30 }.pack
add_btn = TkButton.new(root) { text "Add Todo" }.pack
done_btn = TkButton.new(root) { text "Mark as Done" }.pack

def refresh_list(listbox, todos)
  listbox.clear
  todos.each_with_index do |todo, i|
    status = todo['done'] ? '[x]' : '[ ]'
    listbox.insert('end', "#{i + 1}. #{status} #{todo['task']}")
  end
end

refresh_list(listbox, todos)

add_btn.command = proc {
  task = entry.get
  if task.strip != ""
    todos << { 'task' => task, 'done' => false }
    save_todos(todos)
    refresh_list(listbox, todos)
    entry.delete(0, 'end')
  end
}

done_btn.command = proc {
  idx = listbox.curselection.first
  if idx
    todos[idx]['done'] = true
    save_todos(todos)
    refresh_list(listbox, todos)
  end
}

Tk.mainloop
