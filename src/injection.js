// import browser from 'webextension-polyfill'

const whilelist = [
  'UL',
  'OL',
  'LI',
  'DIV',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'P',
]

const blacklist = [
  'svg',
  'SCRIPT',
  'STYLE',
  // 'BODY',
  // 'FORM',
  // 'TABLE',
  // 'THEAD',
  // 'TBODY',
  // 'TR',
  // 'CODE',
  // 'PRE',
]

function scan_nodes(document, target = document.body) {
  let nodes = []
  let texts = []

  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, null)

  var node
  while ((node = walker.nextNode())) {
    if (blacklist.includes(node.parentNode)) continue

    const text = node.textContent.trim()
    if (!text.match(/\p{Script=Han}/u)) continue

    texts.push(text.replaceAll('\n', '\t'))
    nodes.push(node)
  }

  return { nodes, texts }
}

async function translate() {
  const { nodes, texts } = scan_nodes(document)

  const browser = globalThis.browser || globalThis.chrome
  const storage = await browser.storage.local.get('chivi-mtl')
  const { dname = 'combine', trad = true } = storage
  const params = { input: texts.join('\n'), mode: 'plain', dname, trad }

  const res = await fetch('https://chivi.app/api/qtran', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    alert('Có lỗi, mời liên hệ người phát triển!')
    return
  }

  const data = await res.text()
  const lines = data.split('\n')

  lines.forEach((line, idx) => {
    const node = nodes[idx]
    if (!node) return

    node.textContent = line.replaceAll('\t', '\n')
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
