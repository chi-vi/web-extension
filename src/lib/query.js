export function query(document, el) {
  let nodes = []
  let texts = []

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null)

  var node
  while ((node = walker.nextNode())) {
    const text = node.textContent.trim()
    if (text.match(/\p{Script=Han}/u)) {
      texts.push(text)
      nodes.push(node)
    }
  }

  return { nodes, texts }
}
