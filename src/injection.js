// import browser from 'webextension-polyfill'
import { query } from './lib/query'

async function translate() {
  const { nodes, texts } = query(document, document.body)

  const res = await fetch('https://chivi.app/api/qtran', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: texts.join('\n'),
      dname: 'combine',
      mode: 'plain',
    }),
  })

  if (!res.ok) {
    alert('Có lỗi, mời liên hệ người phát triển!')
    return
  }

  const data = await res.text()

  data.split('\n').forEach((line, idx) => {
    const node = nodes[idx]
    node.textContent = line
    node.parentNode.style.fontFamily = 'Roboto, san-serif'
    node.parentNode.style.lineHeight = '1.5em'
  })
}

const button = document.createElement('button')
button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<polyline points="13 3 13 10 19 10 11 21 11 14 5 14 13 3" />
</svg>`

button.type = 'button'
button.className = 'cv-btn'

document.body.appendChild(button)
button.addEventListener('click', translate)
