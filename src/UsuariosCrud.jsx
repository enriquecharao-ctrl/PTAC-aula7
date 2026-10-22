import { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiDelete, ApiError } from './api'

export default function UsuariosCrud() {
  const [usuarios, setUsuarios] = useState([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [idEdicao, setIdEdicao] = useState(null)
  const [erro, setErro] = useState('')

 
  useEffect(() => {
    const controller = new AbortController()

    async function carregarUsuarios() {
      try {
        setErro('')
        const dados = await apiGet('/users', { signal: controller.signal })
        setUsuarios(dados)
      } catch (err) {
        if (err.name === 'AbortError') return;

        if (err instanceof ApiError) {
          if (err.status === 404) setErro('Recurso não encontrado')
          else if (err.status === 500) setErro('Erro no servidor')
          else setErro(`Erro inesperado da API: ${err.message}`)
        } else {
          setErro('Falha de rede. Verifique sua conexão.')
        }
      }
    }

    carregarUsuarios()

    return () => controller.abort()
  }, [])

  
  async function enviarComHeaderCustomizado() {
    try {
      setErro('')
      await apiPost('/users', 
        { name: 'Gabriel' }, 
        { headers: { 'X-Custom': 'aula07' } } 
      )
      alert('Enviado com sucesso! Verifique os Request Headers na aba Network (F12).')
    } catch (err) {
      setErro('Não foi possível enviar o header customizado.')
    }
  }

  
  async function salvarUsuario(e) {
    e.preventDefault()
    try {
      if (idEdicao) {
        // PUT
        const usuarioAtualizado = await apiPut(`/users/${idEdicao}`, { name: nome, email })
        setUsuarios(usuarios.map(u => u.id === idEdicao ? usuarioAtualizado : u))
        setIdEdicao(null)
      } else {
        // POST
        const novoUsuario = await apiPost('/users', { name: nome, email })
        setUsuarios([...usuarios, novoUsuario])
      }
      setNome('')
      setEmail('')
    } catch (err) {
      setErro('Não foi possível salvar o usuário.')
    }
  }

  // 4. Excluir Usuário
  async function excluirUsuario(id) {
    try {
      await apiDelete(`/users/${id}`)
      setUsuarios(usuarios.filter(u => u.id !== id))
    } catch (err) {
      setErro('Não foi possível excluir o usuário.')
    }
  }

  function iniciarEdicao(usuario) {
    setIdEdicao(usuario.id)
    setNome(usuario.name)
    setEmail(usuario.email)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gerenciamento de Usuários</h1>

      {erro && <p style={{ color: 'red', fontWeight: 'bold' }}>erro:{erro}</p>}

      <form onSubmit={salvarUsuario}>
        <input 
          placeholder="Nome" 
          value={nome} 
          onChange={e => setNome(e.target.value)} 
          required 
        />
        <input 
          placeholder="E-mail" 
          value={email} 
          type="email" 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <button type="submit">{idEdicao ? 'Atualizar' : 'Adicionar'}</button>
        {idEdicao && <button type="button" onClick={() => { setIdEdicao(null); setNome(''); setEmail(''); }}>Cancelar</button>}
      </form>

      
      <div style={{ margin: '15px 0' }}>
        <button type="button" onClick={enviarComHeaderCustomizado} style={{ backgroundColor: '#e0e0e0', padding: '5px 10px', cursor: 'pointer' }}>
           Testar Exercício 5 
        </button>
      </div>

      <ul>
        {usuarios.map(u => (
          <li key={u.id} style={{ margin: '10px 0' }}>
            {u.name} ({u.email})
            <button onClick={() => iniciarEdicao(u)} style={{ marginLeft: '10px' }}>Editar</button>
            <button onClick={() => excluirUsuario(u.id)} style={{ marginLeft: '5px' }}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
