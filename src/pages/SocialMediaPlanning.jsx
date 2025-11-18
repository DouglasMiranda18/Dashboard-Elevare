import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { storage } from '../utils/storage'
import './SocialMediaPlanning.css'

const SocialMediaPlanning = () => {
  const { getUserKey } = useUser()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [tasks, setTasks] = useState({})

  const taskStatuses = [
    { value: 'not-done', label: 'Não feita', icon: '⚪', color: '#95a5a6' },
    { value: 'in-progress', label: 'Em andamento', icon: '🟡', color: '#f39c12' },
    { value: 'completed', label: 'Concluída', icon: '✅', color: '#27ae60' }
  ]

  useEffect(() => {
    const loadTasks = async () => {
      const saved = await storage.get(getUserKey('dailyAgenda'), {})
      if (saved && Object.keys(saved).length > 0) {
        // Migrar tarefas antigas que usavam 'completed' boolean
        const needsMigration = Object.values(saved).some(dateTasks => 
          Array.isArray(dateTasks) && dateTasks.some(task => task.hasOwnProperty('completed') && !task.status)
        )
        
        if (needsMigration) {
          const migratedTasks = {}
          Object.keys(saved).forEach(date => {
            if (Array.isArray(saved[date])) {
              migratedTasks[date] = saved[date].map(task => {
                if (task.status) {
                  return task // Já tem status
                }
                // Migrar de completed (boolean) para status
                return {
                  ...task,
                  status: task.completed ? 'completed' : 'not-done',
                  completed: undefined // Remover propriedade antiga
                }
              })
            } else {
              migratedTasks[date] = saved[date]
            }
          })
          setTasks(migratedTasks)
          await storage.set(getUserKey('dailyAgenda'), migratedTasks)
        } else {
          setTasks(saved)
        }
      }
    }
    loadTasks()

    // Observar mudanças em tempo real (Firebase)
    const unsubscribe = storage.subscribe(
      getUserKey('dailyAgenda'),
      (data) => {
        if (data) {
          setTasks(data)
        }
      },
      {}
    )

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [getUserKey])

  useEffect(() => {
    const saveTasks = async () => {
      if (Object.keys(tasks).length > 0) {
        await storage.set(getUserKey('dailyAgenda'), tasks)
      }
    }
    saveTasks()
  }, [tasks, getUserKey])

  const getTasksForDate = (date) => {
    return tasks[date] || []
  }

  const currentTasks = getTasksForDate(selectedDate)

  const addTask = () => {
    const now = new Date()
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    
    const newTask = {
      id: Date.now(),
      time: timeString,
      description: 'Nova tarefa',
      status: 'not-done'
    }

    setTasks(prev => ({
      ...prev,
      [selectedDate]: [...getTasksForDate(selectedDate), newTask].sort((a, b) => 
        a.time.localeCompare(b.time)
      )
    }))
  }

  const updateTask = (taskId, field, value) => {
    setTasks(prev => ({
      ...prev,
      [selectedDate]: getTasksForDate(selectedDate).map(task =>
        task.id === taskId ? { ...task, [field]: value } : task
      )
    }))
  }

  const changeStatus = (taskId, newStatus) => {
    updateTask(taskId, 'status', newStatus)
  }

  const deleteTask = (taskId) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      setTasks(prev => ({
        ...prev,
        [selectedDate]: getTasksForDate(selectedDate).filter(task => task.id !== taskId)
      }))
    }
  }

  const changeDate = (days) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + days)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0])
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dateOnly = new Date(date)
    dateOnly.setHours(0, 0, 0, 0)

    const isToday = dateOnly.getTime() === today.getTime()
    const isTomorrow = dateOnly.getTime() === today.getTime() + 86400000
    const isYesterday = dateOnly.getTime() === today.getTime() - 86400000

    const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

    let dateLabel = ''
    if (isToday) {
      dateLabel = 'Hoje'
    } else if (isTomorrow) {
      dateLabel = 'Amanhã'
    } else if (isYesterday) {
      dateLabel = 'Ontem'
    } else {
      dateLabel = weekdays[date.getDay()]
    }

    return `${dateLabel}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`
  }

  const getStatusInfo = (status) => {
    return taskStatuses.find(s => s.value === status) || taskStatuses[0]
  }

  const completedTasks = currentTasks.filter(task => task.status === 'completed').length
  const inProgressTasks = currentTasks.filter(task => task.status === 'in-progress').length
  const notDoneTasks = currentTasks.filter(task => task.status === 'not-done').length
  const totalTasks = currentTasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="social-media-planning-page">
      <div className="page-header">
        <h1>Agenda Diária</h1>
        <p>Organize suas tarefas por dia e horário</p>
      </div>

      <div className="agenda-header">
        <div className="date-navigation">
          <button className="btn-date-nav" onClick={() => changeDate(-1)}>
            ← Anterior
          </button>
          <div className="date-display">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-picker"
            />
            <span className="date-label">{formatDate(selectedDate)}</span>
          </div>
          <button className="btn-date-nav" onClick={() => changeDate(1)}>
            Próximo →
          </button>
          <button className="btn-today" onClick={goToToday}>
            Hoje
          </button>
        </div>

        <div className="agenda-stats">
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{totalTasks}</span>
          </div>
          <div className="stat-item stat-completed">
            <span className="stat-label">Concluídas:</span>
            <span className="stat-value">{completedTasks}</span>
          </div>
          <div className="stat-item stat-in-progress">
            <span className="stat-label">Em andamento:</span>
            <span className="stat-value">{inProgressTasks}</span>
          </div>
          <div className="stat-item stat-not-done">
            <span className="stat-label">Não feitas:</span>
            <span className="stat-value">{notDoneTasks}</span>
          </div>
        </div>

        <div className="agenda-progress">
          <div className="progress-info">
            <span className="progress-text">{completedTasks} de {totalTasks} tarefas concluídas</span>
            <span className="progress-percentage">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="agenda-content">
        {currentTasks.length === 0 ? (
          <div className="empty-agenda">
            <div className="empty-icon">📅</div>
            <h3>Nenhuma tarefa para este dia</h3>
            <p>Clique no botão abaixo para adicionar sua primeira tarefa</p>
            <button className="btn btn-primary" onClick={addTask}>
              + Adicionar Primeira Tarefa
            </button>
          </div>
        ) : (
          <div className="tasks-list">
            {currentTasks.map((task) => {
              const statusInfo = getStatusInfo(task.status)
              return (
                <div 
                  key={task.id} 
                  className={`task-item task-status-${task.status}`}
                  style={{ borderLeftColor: statusInfo.color }}
                >
                  <div className="task-status-selector">
                    <select
                      value={task.status}
                      onChange={(e) => changeStatus(task.id, e.target.value)}
                      className="status-select"
                      style={{ 
                        borderColor: statusInfo.color,
                        color: statusInfo.color
                      }}
                    >
                      {taskStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.icon} {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="time"
                    value={task.time}
                    onChange={(e) => updateTask(task.id, 'time', e.target.value)}
                    className="task-time"
                  />
                  <input
                    type="text"
                    value={task.description}
                    onChange={(e) => updateTask(task.id, 'description', e.target.value)}
                    className="task-description"
                    placeholder="Descrição da tarefa..."
                  />
                  <button
                    className="btn-delete-task"
                    onClick={() => deleteTask(task.id)}
                    title="Excluir tarefa"
                  >
                    🗑️
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {currentTasks.length > 0 && (
          <div className="agenda-actions">
            <button className="btn btn-primary" onClick={addTask}>
              + Adicionar Tarefa
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SocialMediaPlanning