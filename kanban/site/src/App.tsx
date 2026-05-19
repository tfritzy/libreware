import { useState, useEffect } from 'react'
import { auth } from './lib/firebase'
import { signInAnonymously, signOut } from 'firebase/auth'
import { useAuth } from './lib/useAuth'
import {
  subscribeBoards, createBoard,
  subscribeLists, createList,
  subscribeTasks, createTask, moveTask,
} from './lib/db'
import type { Board, List, Task } from './lib/types'

function App() {
  const { user } = useAuth()
  const [boards, setBoards] = useState<Board[]>([])
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)
  const [lists, setLists] = useState<List[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  const [newBoardName, setNewBoardName] = useState('')
  const [newListName, setNewListName] = useState('')
  // per-list form state: listId -> { name, description }
  const [newTaskFields, setNewTaskFields] = useState<Record<string, { name: string; description: string }>>({})

  // Subscribe to boards
  useEffect(() => {
    if (!user) return
    return subscribeBoards(user.uid, setBoards)
  }, [user])

  // Subscribe to lists and tasks when board is selected
  useEffect(() => {
    if (!selectedBoardId) return;
    const unsubLists = subscribeLists(selectedBoardId, setLists)
    const unsubTasks = subscribeTasks(selectedBoardId, setTasks)
    return () => { unsubLists(); unsubTasks(); setLists([]); setTasks([]) }
  }, [selectedBoardId])

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBoardName.trim() || !user) return
    await createBoard(user.uid, newBoardName.trim())
    setNewBoardName('')
  }

  const handleAddList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim() || !selectedBoardId) return
    await createList(selectedBoardId, newListName.trim(), lists.length)
    setNewListName('')
  }

  const handleAddTask = async (e: React.FormEvent, listId: string) => {
    e.preventDefault()
    if (!selectedBoardId) return
    const fields = newTaskFields[listId] ?? { name: '', description: '' }
    if (!fields.name.trim()) return
    const tasksInList = tasks.filter(t => t.listId === listId)
    await createTask(selectedBoardId, listId, fields.name.trim(), fields.description.trim(), tasksInList.length)
    setNewTaskFields(prev => ({ ...prev, [listId]: { name: '', description: '' } }))
  }

  const handleMoveTask = async (taskId: string, newListId: string) => {
    await moveTask(taskId, newListId)
  }

  const setTaskField = (listId: string, field: 'name' | 'description', value: string) => {
    setNewTaskFields(prev => ({
      ...prev,
      [listId]: { ...(prev[listId] ?? { name: '', description: '' }), [field]: value },
    }))
  }

  if (!user) {
    return (
      <div>
        <p>Please log in to use the kanban board.</p>
        <button onClick={() => signInAnonymously(auth)}>Login Anonymously</button>
      </div>
    )
  }

  const selectedBoard = boards.find(b => b.id === selectedBoardId)

  return (
    <div>
      <header>
        <span>UID: {user.uid.slice(0, 8)}...</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </header>

      <section>
        <h2>Boards</h2>
        <ul>
          {boards.map(board => (
            <li key={board.id}>
              <button onClick={() => setSelectedBoardId(board.id)}>
                {board.name}{board.id === selectedBoardId ? ' (selected)' : ''}
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddBoard}>
          <input
            value={newBoardName}
            onChange={e => setNewBoardName(e.target.value)}
            placeholder="New board name"
          />
          <button type="submit">Add Board</button>
        </form>
      </section>

      {selectedBoard && (
        <section>
          <h2>{selectedBoard.name}</h2>

          <form onSubmit={handleAddList}>
            <input
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              placeholder="New list name"
            />
            <button type="submit">Add List</button>
          </form>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            {lists.map(list => {
              const listTasks = tasks.filter(t => t.listId === list.id)
              const fields = newTaskFields[list.id] ?? { name: '', description: '' }
              return (
                <div key={list.id}>
                  <h3>{list.name}</h3>
                  <ul>
                    {listTasks.map(task => (
                      <li key={task.id}>
                        <strong>{task.name}</strong>
                        {task.description && <p>{task.description}</p>}
                        <select
                          value={list.id}
                          onChange={e => handleMoveTask(task.id, e.target.value)}
                        >
                          {lists.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                          ))}
                        </select>
                      </li>
                    ))}
                  </ul>
                  <form onSubmit={e => handleAddTask(e, list.id)}>
                    <input
                      value={fields.name}
                      onChange={e => setTaskField(list.id, 'name', e.target.value)}
                      placeholder="Task name"
                    />
                    <input
                      value={fields.description}
                      onChange={e => setTaskField(list.id, 'description', e.target.value)}
                      placeholder="Description"
                    />
                    <button type="submit">Add Task</button>
                  </form>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

export default App
