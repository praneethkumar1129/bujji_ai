document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const input = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const micBtn = document.getElementById("mic-btn");
  const clearBtn = document.getElementById("clear-btn");
  const stopBtn = document.getElementById("stop-btn");
  const themeToggle = document.getElementById("theme-toggle");
  const modeSwitch = document.getElementById("mode-toggle");
  const langSelect = document.getElementById("language-select");
  const uiLangSelect = document.getElementById("ui-language-select");

  const uiTranslations = {
    en: {
      title: "HI, I AM BUJJI",
      placeholder: "Type your message...",
      send: "Send",
      mic: "Mic",
      clear: "Clear",
      stop: "Stop AI Voice",
      translateMode: "Translate Mode",
      chatMode: "Chat Mode"
    },
    te: {
      title: "హాయ్, నేనే బుజ్జి",
      placeholder: "మీ సందేశాన్ని టైప్ చేయండి...",
      send: "పంపించు",
      mic: "మైక్",
      clear: "తొలగించు",
      stop: "వాయిస్ ఆపండి",
      translateMode: "అనువాద మోడ్",
      chatMode: "చాట్ మోడ్"
    },
    hi: {
      title: "नमस्ते, मैं बुज्जी हूँ",
      placeholder: "अपना संदेश टाइप करें...",
      send: "भेजें",
      mic: "माइक",
      clear: "साफ करें",
      stop: "वॉइस बंद करें",
      translateMode: "अनुवाद मोड",
      chatMode: "चैट मोड"
    },
    ta: {
      title: "வணக்கம், நான் புஜ்ஜி",
      placeholder: "உங்கள் செய்தியை உள்ளிடவும்...",
      send: "அனுப்பு",
      mic: "மைக்ரோஃபோன்",
      clear: "அழி",
      stop: "ஒலி நிறுத்து",
      translateMode: "மொழிபெயர்ப்பு முறை",
      chatMode: "சாட் முறை"
    },
    kn: {
      title: "ನಮಸ್ಕಾರ, ನಾನು ಬುಜ್ಜಿ",
      placeholder: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
      send: "ಕಳುಹಿಸಿ",
      mic: "ಮೈಕ್",
      clear: "ಅಳಿಸಿ",
      stop: "ವಾಯ್ಸ್ ನಿಲ್ಲಿಸಿ",
      translateMode: "ಭಾಷಾಂತರ ಮೋಡ್",
      chatMode: "ಚಾಟ್ ಮೋಡ್"
    },
    ml: {
      title: "ഹായ്, ഞാൻ ബുജ്ജി",
      placeholder: "നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക...",
      send: "അയയ്ക്കുക",
      mic: "മൈക്ക്",
      clear: "ശുദ്ധീകരിക്കുക",
      stop: "വോയിസ് നിർത്തുക",
      translateMode: "ഭാഷാന്തര മോഡ്",
      chatMode: "ചാറ്റ് മോഡ്"
    },
    bn: {
      title: "হ্যালো, আমি বুজ্জি",
      placeholder: "আপনার বার্তা টাইপ করুন...",
      send: "পাঠান",
      mic: "মাইক",
      clear: "পরিষ্কার করুন",
      stop: "ভয়েস বন্ধ করুন",
      translateMode: "অনুবাদ মোড",
      chatMode: "চ্যাট মোড"
    },
    gu: {
      title: "હાય, હું બુજ્જી છું",
      placeholder: "તમારો સંદેશ લખો...",
      send: "મોકલો",
      mic: "માઇક",
      clear: "સાફ કરો",
      stop: "વોઇસ બંધ કરો",
      translateMode: "અનુવાદ મોડ",
      chatMode: "ચેટ મોડ"
    },
    it: {
      title: "Ciao, sono Bujji",
      placeholder: "Digita il tuo messaggio...",
      send: "Invia",
      mic: "Microfono",
      clear: "Pulisci",
      stop: "Ferma Voce AI",
      translateMode: "Modalità Traduzione",
      chatMode: "Modalità Chat"
    },
    pt: {
      title: "Olá, eu sou Bujji",
      placeholder: "Digite sua mensagem...",
      send: "Enviar",
      mic: "Microfone",
      clear: "Limpar",
      stop: "Parar Voz AI",
      translateMode: "Modo Tradução",
      chatMode: "Modo Chat"
    },
    fr: {
      title: "Bonjour, je suis Bujji",
      placeholder: "Tapez votre message...",
      send: "Envoyer",
      mic: "Micro",
      clear: "Effacer",
      stop: "Arrêter la voix AI",
      translateMode: "Mode Traduction",
      chatMode: "Mode Chat"
    }
  };

  const langMap = {
    "Telugu": "tel_Telu", "Hindi": "hin_Deva", "Tamil": "tam_Taml",
    "Kannada": "kan_Knda", "Malayalam": "mal_Mlym", "Bengali": "ben_Beng",
    "Gujarati": "guj_Gujr", "Punjabi": "pan_Guru", "Urdu": "urd_Arab",
    "Spanish": "spa_Latn", "French": "fra_Latn", "German": "deu_Latn",
    "Italian": "ita_Latn", "Portuguese": "por_Latn", "Russian": "rus_Cyrl",
    "Chinese": "zho_Hans", "Japanese": "jpn_Jpan", "Korean": "kor_Hang",
    "Arabic": "arb_Arab", "Turkish": "tur_Latn", "English": "eng_Latn"
  };

  let isTranslate = false;
  let synth = window.speechSynthesis;

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {};
  }

  themeToggle.onclick = () => {
    document.body.classList.toggle("dark-theme");
    document.getElementById("theme-icon").textContent =
      document.body.classList.contains("dark-theme") ? "☀️" : "🌙";
  };

  modeSwitch.onclick = () => {
    isTranslate = !isTranslate;
    modeSwitch.classList.toggle("active", isTranslate);
    const selectedLang = uiLangSelect.value || "en";
    const t = uiTranslations[selectedLang] || uiTranslations.en;
    modeSwitch.textContent = isTranslate ? t.chatMode : t.translateMode;
    langSelect.style.display = isTranslate ? "inline-block" : "none";
  };

  if ('webkitSpeechRecognition' in window) {
    micBtn.onclick = () => {
      const rec = new webkitSpeechRecognition();
      rec.lang = "en-US";
      rec.onresult = e => {
        input.value = e.results[0][0].transcript;
        send();
      };
      rec.start();
    };
  } else {
    micBtn.disabled = true;
  }

  stopBtn.onclick = () => {
    if (synth.speaking) synth.cancel();
  };

  clearBtn.onclick = () => {
    chatBox.innerHTML = "";
  };

  input.onkeypress = e => {
    if (e.key === "Enter") send();
  };

  sendBtn.onclick = () => send();

  function append(sender, text, isHtml = false) {
    const div = document.createElement("div");
    div.className = "message " + (sender === "user" ? "user" : "ai");
    div.innerHTML = `<strong>${sender === "user" ? "🧑‍🎨 You" : "🤖 Bujji"}:</strong><div class="msg-text">${isHtml ? text : escapeHtml(text)}</div>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function renderStructuredReply(markdownText) {
    const html = marked.parse(markdownText);
    const div = document.createElement("div");
    div.className = "message ai";
    div.innerHTML = `<strong>🤖 Bujji:</strong><div class="msg-text">${html}</div>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function removeEmojis(text) {
    return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\*#_~>]+/gu, '')
               .replace(/<\/?[^>]+(>|$)/g, '')
               .replace(/\s{2,}/g, ' ')
               .trim();
  }

  function getLangCodeForSpeech(lang) {
    const map = {
      "Telugu": "te-IN", "Hindi": "hi-IN", "Tamil": "ta-IN",
      "Kannada": "kn-IN", "Malayalam": "ml-IN", "Bengali": "bn-IN",
      "Gujarati": "gu-IN", "Punjabi": "pa-IN", "Urdu": "ur-IN",
      "Spanish": "es-ES", "French": "fr-FR", "German": "de-DE",
      "Italian": "it-IT", "Portuguese": "pt-PT", "Russian": "ru-RU",
      "Chinese": "zh-CN", "Japanese": "ja-JP", "Korean": "ko-KR",
      "Arabic": "ar-SA", "Turkish": "tr-TR", "English": "en-US"
    };
    return map[lang] || "en-US";
  }

  function speak(text, lang = "en-US") {
    if (synth.speaking) synth.cancel();
    const utter = new SpeechSynthesisUtterance(removeEmojis(text));
    utter.lang = lang;
    const voices = synth.getVoices();
    utter.voice = voices.find(v => v.lang === lang && /female/i.test(v.name)) ||
                  voices.find(v => v.name.includes("Google UK English Female")) ||
                  voices.find(v => v.name.includes("Microsoft Aria")) ||
                  voices.find(v => v.lang === lang) ||
                  voices[0];
    synth.speak(utter);
  }

  function send() {
    const txt = input.value.trim();
    if (!txt) return;
    append("user", txt);
    input.value = "";

    const loaderDiv = document.createElement("div");
    loaderDiv.className = "message ai";
    loaderDiv.id = "chat-loader";
    loaderDiv.innerHTML = `<strong>🤖 Bujji:</strong><div class="msg-text"><span class="dot-loader"><span></span><span></span><span></span></span></div>`;
    chatBox.appendChild(loaderDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (isTranslate) {
      const selectedLang = langSelect.options[langSelect.selectedIndex].text;
      const lang = langMap[selectedLang] || "eng_Latn";
      fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: txt, target_lang: lang })
      })
      .then(res => res.json())
      .then(data => {
        document.getElementById("chat-loader")?.remove();
        if (data.translation) {
          append("bujji", data.translation);
          speak(data.translation, getLangCodeForSpeech(selectedLang));
        } else {
          append("bujji", "❌ Translation failed");
        }
      })
      .catch(() => {
        document.getElementById("chat-loader")?.remove();
        append("bujji", "❌ Translation error");
      });
    } else {
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: txt, username: "user" })
      })
      .then(res => res.json())
      .then(data => {
        document.getElementById("chat-loader")?.remove();
        if (data.response) {
          renderStructuredReply(data.response);
          speak(data.response);
        } else {
          append("bujji", "❌ Chat failed");
        }
      })
      .catch(() => {
        document.getElementById("chat-loader")?.remove();
        append("bujji", "❌ Chat error");
      });
    }
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function (m) {
      return {
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
      }[m];
    });
  }

  function applyUILanguage(lang) {
    const t = uiTranslations[lang] || uiTranslations["en"];
    document.querySelector(".top-left-title").textContent = t.title;
    document.getElementById("user-input").placeholder = t.placeholder;
    document.getElementById("send-btn").textContent = t.send;
    document.getElementById("mic-btn").textContent = t.mic;
    document.getElementById("clear-btn").textContent = t.clear;
    document.getElementById("stop-btn").textContent = t.stop;
    document.getElementById("mode-toggle").textContent = isTranslate ? t.chatMode : t.translateMode;
  }

  const savedLang = localStorage.getItem("uiLang") || "en";
  uiLangSelect.value = savedLang;
  applyUILanguage(savedLang);

  uiLangSelect.onchange = () => {
    localStorage.setItem("uiLang", uiLangSelect.value);
    applyUILanguage(uiLangSelect.value);
  };
});
