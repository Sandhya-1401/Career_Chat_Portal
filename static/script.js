document.addEventListener('DOMContentLoaded', async () => {

  /* ───── DOM refs & basic behaviour ───── */
  const form  = document.getElementById('chat-form');
  const input = document.getElementById('user-input');
  const send  = document.getElementById('send-btn');
  const log   = document.getElementById('chat-log');
  const ping  = document.getElementById('message-sound');
  const emojiToggle = document.getElementById('emoji-toggle');

  input.addEventListener('input', () => { send.disabled = !input.value.trim(); });

  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const txt = input.value.trim();
    if (!txt) return;

    addBubble(txt, 'user');
    input.value = ''; send.disabled = true;

    const loader = addTyping();
    try {
      const r = await fetch('/get_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ user_query: txt })
      });
      const d = await r.json();
      loader.remove();
      const botB = addBubble(d.response, 'bot');
      ping.play();
      attachActions(botB);
    } catch (err) {
      loader.remove();
      addBubble('⚠️ ' + err.message, 'bot');
    }
    send.disabled = false; input.focus();
  });

  /* ───── helper: add missing breaks before 1. 2. 3. lists ───── */
  function ensureNewlines(str) {
    return str.replace(/([a-z])\s+(\d+\.\s+\*\*)/gi, '$1\n\n$2');
  }

  /* ───── chat bubble creators ───── */
  function addBubble(msg, who) {
    const div = document.createElement('div');
    div.className = `bubble ${who}`;

    /* Markdown → clean HTML */
    const html = marked.parse(ensureNewlines(msg), { breaks:true, gfm:true });

    div.innerHTML = `
      <div class="bubble-text">${html}</div>
      ${who === 'bot' ? `
      <div class="message-actions">
        <button class="speak-btn"   title="Speak">🔊</button>
        <button class="copy-btn"    title="Copy">📋</button>
        <button class="like-btn"    title="Like">👍</button>
        <button class="dislike-btn" title="Dislike">👎</button>
      </div>` : ''}`;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function addTyping() {
    const w = document.createElement('div');
    w.className = 'bubble bot';
    w.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
    log.appendChild(w);
    log.scrollTop = log.scrollHeight;
    return w;
  }

  function attachActions(bubble) {
    const txt  = bubble.querySelector('.bubble-text').textContent;
    const speak= bubble.querySelector('.speak-btn');
    const copy = bubble.querySelector('.copy-btn');
    const like = bubble.querySelector('.like-btn');
    const hate = bubble.querySelector('.dislike-btn');

    speak.onclick = () => speechSynthesis.speak(new SpeechSynthesisUtterance(txt));
    copy.onclick  = () => navigator.clipboard.writeText(txt).then(() => {
      copy.textContent = '✅'; setTimeout(() => copy.textContent = '📋', 1500);
    });
    like.onclick = () => { like.style.color='#0a8d00'; hate.style.color=''; };
    hate.onclick = () => { hate.style.color='#d71d24'; like.style.color=''; };
  }

  /* ───── Emoji picker (import once) ───── */
  const { EmojiButton } =
    await import('https://unpkg.com/@joeattardi/emoji-button@latest/dist/index.js');

  const picker = new EmojiButton({
    position: 'top-start',
    theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  });

  emojiToggle.addEventListener('click', () => picker.togglePicker(emojiToggle));

  picker.on('emoji', sel => {
    const char = typeof sel === 'string' ? sel : sel.emoji ?? sel.i ?? '';
    insertAtCursor(input, char);
    input.dispatchEvent(new Event('input'));
    input.focus();
  });

  /* --------------------------------------- */
  function insertAtCursor(el, emoji) {
    const s = el.selectionStart, e = el.selectionEnd;
    el.value = el.value.slice(0,s) + emoji + el.value.slice(e);
    el.selectionStart = el.selectionEnd = s + emoji.length;
  }
});

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = () => {
  document.documentElement.classList.toggle('dark');
  themeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
};

