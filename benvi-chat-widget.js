/*
BENVI Collective — WhatsApp chat widget
Drop-in embed for guest house websites.

Usage — add this one line before </body>:
<script src="https://YOUR-HOSTING-URL/benvi-chat-widget.js"
        data-number="27878133532"
        data-name="Hage Hall"
        data-greeting="Hi, I'd like to ask about a booking."></script>

data-number   required. WhatsApp number in international format, digits only (no +, no spaces).
data-name     optional. Guest house name shown in the panel. Defaults to "Chat with us".
data-greeting optional. Pre-filled WhatsApp message. Defaults to a generic booking question.
*/
(function () {
  'use strict';

  var scriptTag = document.currentScript;
  if (!scriptTag) return;

  var rawNumber = scriptTag.getAttribute('data-number') || '';
  var number = rawNumber.replace(/[^\d]/g, '');
  var name = scriptTag.getAttribute('data-name') || 'Chat with us';
  var greeting = scriptTag.getAttribute('data-greeting') || ('Hi, I\'d like to ask about a booking at ' + name + '.');

  // Logo lives next to this script by default (same folder on whatever host serves it).
  // Override with data-logo="https://.../bc-monogram.jpg" if it's hosted somewhere else.
  var scriptSrc = scriptTag.src || '';
  var basePath = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);
  var logoUrl = scriptTag.getAttribute('data-logo') || (basePath ? basePath + 'bc-monogram.jpg' : '');

  if (!number) {
    console.error('BENVI chat widget: data-number is missing or invalid. Widget not loaded.');
    return;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Load brand fonts
  if (!document.getElementById('bcw-fonts')) {
    var fontLink = document.createElement('link');
    fontLink.id = 'bcw-fonts';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Bai+Jamjuree:wght@400;500;600&display=swap';
    document.head.appendChild(fontLink);
  }

  // Styles
  var style = document.createElement('style');
  style.textContent = [
    '.bcw-wrap{position:fixed;bottom:20px;right:20px;z-index:999999;font-family:"Bai Jamjuree",sans-serif;}',
    '.bcw-bubble{width:60px;height:60px;border-radius:50%;background:#1F3250;border:none;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(31,50,80,0.35);',
    'transition:transform 0.15s ease;padding:0;}',
    '.bcw-bubble:hover{transform:scale(1.06);}',
    '.bcw-bubble svg{width:28px;height:28px;}',
    '.bcw-pulse{animation:bcwPulse 2s ease-out 2;}',
    '@keyframes bcwPulse{0%{box-shadow:0 4px 14px rgba(31,50,80,0.35),0 0 0 0 rgba(194,163,107,0.55);}',
    '100%{box-shadow:0 4px 14px rgba(31,50,80,0.35),0 0 0 16px rgba(194,163,107,0);}}',
    '.bcw-panel{position:absolute;bottom:74px;right:0;width:300px;max-width:calc(100vw - 40px);',
    'background:#F1EDE4;border-radius:16px;box-shadow:0 10px 30px rgba(31,50,80,0.25);',
    'opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity 0.18s ease,transform 0.18s ease;overflow:hidden;}',
    '.bcw-panel.bcw-open{opacity:1;transform:translateY(0);pointer-events:auto;}',
    '.bcw-panel-head{background:#1F3250;padding:16px;display:flex;align-items:center;gap:10px;position:relative;}',
    '.bcw-monogram{width:38px;height:38px;border-radius:50%;background:#C2A36B;color:#1F3250;',
    'display:flex;align-items:center;justify-content:center;font-family:"Instrument Serif",serif;font-size:18px;flex-shrink:0;',
    'overflow:hidden;position:relative;}',
    '.bcw-monogram img{width:100%;height:100%;object-fit:cover;display:block;}',
    '.bcw-monogram-fallback{display:none;width:100%;height:100%;align-items:center;justify-content:center;',
    'position:absolute;top:0;left:0;}',
    '.bcw-name{font-family:"Instrument Serif",serif;color:#F1EDE4;font-size:19px;line-height:1.2;}',
    '.bcw-status{color:#C2A36B;font-size:12px;margin-top:2px;}',
    '.bcw-close{position:absolute;top:10px;right:12px;background:none;border:none;color:#F1EDE4;',
    'font-size:20px;cursor:pointer;line-height:1;padding:4px;opacity:0.8;}',
    '.bcw-close:hover{opacity:1;}',
    '.bcw-panel-body{padding:16px;}',
    '.bcw-panel-body p{margin:0;color:#2A2622;font-size:14px;line-height:1.5;}',
    '.bcw-cta{display:block;text-align:center;margin:0 16px 16px;padding:12px;background:#C2A36B;',
    'color:#1F3250;text-decoration:none;font-size:14px;font-weight:600;border-radius:10px;',
    'transition:background 0.15s ease;}',
    '.bcw-cta:hover{background:#b0925c;}',
    '@media (max-width:420px){.bcw-panel{right:0;width:calc(100vw - 40px);}}'
  ].join('');
  document.head.appendChild(style);

  var waUrl = 'https://wa.me/' + number + '?text=' + encodeURIComponent(greeting);

  var wrap = document.createElement('div');
  wrap.className = 'bcw-wrap';
  wrap.innerHTML =
    '<div class="bcw-panel" id="bcwPanel">' +
      '<div class="bcw-panel-head">' +
        '<div class="bcw-monogram">' +
          (logoUrl ? '<img src="' + logoUrl + '" alt="' + escapeHtml(name) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">' : '') +
          '<span class="bcw-monogram-fallback" style="' + (logoUrl ? '' : 'display:flex;') + 'font-family:\'Instrument Serif\',serif;font-size:18px;">BC</span>' +
        '</div>' +
        '<div>' +
          '<div class="bcw-name">' + escapeHtml(name) + '</div>' +
          '<div class="bcw-status">Online now</div>' +
        '</div>' +
        '<button class="bcw-close" id="bcwClose" aria-label="Close chat">&times;</button>' +
      '</div>' +
      '<div class="bcw-panel-body">' +
        '<p>Ask about rooms, rates or your booking. We reply right away, any time of day.</p>' +
      '</div>' +
      '<a class="bcw-cta" id="bcwCta" href="' + waUrl + '" target="_blank" rel="noopener noreferrer">Start chat on WhatsApp</a>' +
    '</div>' +
    '<button class="bcw-bubble bcw-pulse" id="bcwBubble" aria-label="Open WhatsApp chat">' +
      '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M16 4C9.4 4 4 9.4 4 16c0 2.2.6 4.3 1.7 6.1L4 28l6.1-1.6C11.8 27.4 13.9 28 16 28c6.6 0 12-5.4 12-12S22.6 4 16 4z" fill="#C2A36B"/>' +
        '<path d="M22.1 19.2c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.9-.8 2.1-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.4z" fill="#1F3250"/>' +
      '</svg>' +
    '</button>';

  document.body.appendChild(wrap);

  var panel = document.getElementById('bcwPanel');
  var bubble = document.getElementById('bcwBubble');

  bubble.addEventListener('click', function () {
    panel.classList.toggle('bcw-open');
    bubble.classList.remove('bcw-pulse');
  });
  document.getElementById('bcwClose').addEventListener('click', function () {
    panel.classList.remove('bcw-open');
  });
  document.addEventListener('click', function (e) {
    if (!wrap.contains(e.target)) {
      panel.classList.remove('bcw-open');
    }
  });
})();
