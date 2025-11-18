import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import './Login.css'

const Login = () => {
  const { loginWithEmail, registerWithEmail, loading } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (isRegister) {
      // Registro
      if (!name.trim()) {
        setError('Por favor, informe seu nome.')
        setIsLoading(false)
        return
      }
      const result = await registerWithEmail(email, password, name.trim())
      if (!result.success) {
        setError(result.error)
        setIsLoading(false)
      }
    } else {
      // Login
      const result = await loginWithEmail(email, password)
      if (!result.success) {
        setError(result.error)
        setIsLoading(false)
      }
    }
  }

  const toggleMode = () => {
    setIsRegister(!isRegister)
    setError('')
    setEmail('')
    setPassword('')
    setName('')
  }

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-loading">
            <p>Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-logo">Elevare</h1>
          <p className="login-subtitle">Dashboard Interno</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h3>{isRegister ? 'Criar Nova Conta' : 'Entrar'}</h3>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {isRegister && (
            <div className="form-group">
              <label>Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
                required={isRegister}
                autoFocus={isRegister}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoFocus={!isRegister}
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              minLength={6}
            />
            {isRegister && (
              <p className="form-hint">
                A senha deve ter pelo menos 6 caracteres
              </p>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : (isRegister ? 'Criar Conta' : 'Entrar')}
          </button>

          <div className="form-footer">
            <button
              type="button"
              className="btn-toggle-mode"
              onClick={toggleMode}
            >
              {isRegister 
                ? 'Já tem uma conta? Entrar' 
                : 'Não tem uma conta? Criar conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login