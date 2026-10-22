const BASE_URL = 'https://jsonplaceholder.typicode.com'


export class ApiError extends Error {
  constructor(status, statusText) {
    super(`HTTP ${status} ${statusText}`)
    this.name = 'ApiError'
    this.status = status; 
    this.statusText = statusText;
  }
}

async function requisicao(caminho, opcoes = {}) {
  const url = `${BASE_URL}${caminho}`
  

  const { headers: headersAdicionais, ...outrasOpcoes } = opcoes;

  const configuracoes = {
    headers: { 
      'Content-Type': 'application/json', 
      ...headersAdicionais              
    },
    ...outrasOpcoes, 
  }

  if (opcoes.body) {
    configuracoes.body = JSON.stringify(opcoes.body)
  }

  const resp = await fetch(url, configuracoes)

  if (!resp.ok) {
    throw new ApiError(resp.status, resp.statusText)
  }

  if (resp.status === 204) return null
  return await resp.json()
}

export async function apiGet(caminho, opcoes = {}) {
  return requisicao(caminho, { method: 'GET', ...opcoes })
}

export async function apiPost(caminho, body, opcoes = {}) {
  return requisicao(caminho, { method: 'POST', body, ...opcoes })
}

export async function apiPut(caminho, body, opcoes = {}) {
  return requisicao(caminho, { method: 'PUT', body, ...opcoes })
}

export async function apiDelete(caminho, opcoes = {}) {
  return requisicao(caminho, { method: 'DELETE', ...opcoes })
}

