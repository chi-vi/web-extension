// import browser from 'webextension-polyfill'

const whilelist = ['UL', 'OL', 'LI', 'DIV', 'P']
const blacklist = ['svg', 'SCRIPT', 'STYLE']

function scan_nodes(document, target = document.body) {
  let nodes = []
  let texts = []
  let count = 0

  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, null)

  var node
  while ((node = walker.nextNode())) {
    if (blacklist.includes(node.parentNode.nodeName)) continue

    const text = node.textContent
    if (!text.match(/\p{Script=Han}/u)) continue

    count += text.size
    if (count > 4000) break

    texts.push(text.replaceAll('\n', '··').trim())
    nodes.push(node)
  }

  return { nodes, texts }
}

const endpoint = 'https://chivi.app/api/qtran'
async function translate() {
  const { nodes, texts } = scan_nodes(document)

  // const browser = globalThis.browser || globalThis.chrome
  // const storage = await browser.storage.local.get('chivi-mtl')
  // const { dname = 'combine' } = storage

  const res = await fetch(endpoint, { method: 'POST', body: texts.join('\n') })
  const data = await res.text()
  if (!res.ok) return alert(data)

  const lines = data.split('\n')

  lines.forEach((line, idx) => {
    const node = nodes[idx]
    if (!node) return

    node.textContent = line.replaceAll('··', '\n')
    const parent = node.parentNode

    if (whilelist.includes(parent.nodeName)) {
      parent.style.fontFamily = 'Roboto, san-serif'
      parent.style.lineHeight = '1.5em'
    }
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
