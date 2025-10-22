(() => {
  const messages = document.getElementById('messages')
  const form = document.getElementById('form')
  const input = document.getElementById('input')
  const usernameInput = document.getElementById('username')
  const connectBtn = document.getElementById('connect')

  let ws
  let localUsername = null

  function append(text) {
    const li = document.createElement('li')
    li.textContent = text
    messages.appendChild(li)
    window.scrollTo(0, document.body.scrollHeight)
  }

  function usernameColor(name) {
    // simple hash to h value
    let h = 0
    for (let i = 0; i < name.length; i++) {
      h = (h << 5) - h + name.charCodeAt(i)
      h |= 0
    }
    const hue = Math.abs(h) % 360
    return `hsl(${hue} 70% 45%)`
  }

  function renderMessage(m) {
    const li = document.createElement('li')
    li.className = 'msg'
    // Standard chat UX: messages sent by the local user appear on the right
    if (m.username && localUsername && m.username === localUsername) {
      li.classList.add('me')
    } else {
      li.classList.add('other')
    }

    if (m.type === 'message') {
      const avatar = document.createElement('span')
      avatar.className = 'avatar'
      avatar.style.background = usernameColor(m.username || 'anon')
      avatar.textContent = (m.username || 'anon').slice(0,1).toUpperCase()

      const body = document.createElement('div')
      body.className = 'body'
      const who = document.createElement('div')
      who.className = 'who'
      who.textContent = m.username || 'anon'
      const text = document.createElement('div')
      text.className = 'text'
      text.textContent = m.body

      body.appendChild(who)
      body.appendChild(text)

      li.appendChild(avatar)
      li.appendChild(body)
    } else {
      li.textContent = JSON.stringify(m)
    }

    messages.appendChild(li)
    window.scrollTo(0, document.body.scrollHeight)
  }

  connectBtn.addEventListener('click', () => {
    const username = usernameInput.value || 'anonymous'
    localUsername = username
    if (connectBtn.disabled) return
    ws = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws?username=' + encodeURIComponent(username))
    ws.addEventListener('open', () => {
      append('Connected as ' + username)
      connectBtn.disabled = true
      usernameInput.disabled = true
    })
    ws.addEventListener('message', (evt) => {
      try {
        const m = JSON.parse(evt.data)
        switch (m.type) {
          case 'message':
            renderMessage(m)
            break
          case 'join':
            append('* ' + m.username + ' joined')
            break
          case 'leave':
            append('* ' + m.username + ' left')
            break
          case 'users':
              // show users in join order; UI list can be improved later
              append('* users: ' + (m.users || []).join(', '))
            break
          case 'error':
            append('Error: ' + m.error)
            break
        }
      } catch (e) {
        append('invalid message: ' + evt.data)
      }
    })
    ws.addEventListener('close', () => append('Disconnected'))
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!ws || ws.readyState !== WebSocket.OPEN) return append('Not connected')
    const body = input.value
    if (!body) return
    ws.send(JSON.stringify({ type: 'message', body }))
    input.value = ''
  })
})()
