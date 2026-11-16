(() => {
  const chats = [
    { id: "italo", name: "Italo Cardenas", verified: true, status: "en línea",
      msgs: [
        { from: "in",  t: "09:12", text: "Brayan, vi tu solicitud en Conocer Gente. Veo que también te gustan el fútbol y el diseño." },
        { from: "out", t: "09:14", text: "Sí, tenemos 3 intereses en común, por eso te escribí. ¿Eres de Ingeniería de Software?" },
        { from: "in",  t: "09:15", text: "Sí, 4.º ciclo. Hoy hay una actividad de fútbol 5 a las 4 p. m. en la loza del campus." },
        { from: "out", t: "09:16", text: "¿Todavía quedan cupos? Ayer vi que eran 10." },
        { from: "in",  t: "09:17", text: "Quedaban 3. Apúntate antes de que se llene, yo ya me apunté." },
        { from: "out", t: "09:19", text: "Listo, ya me apunté. Me llegó la confirmación." },
        { from: "in",  t: "09:20", text: "Perfecto. Nos vemos en la entrada principal 15 minutos antes." }
      ],
      replies: ["Dale, ahí nos vemos.", "Llevo una pelota por si acaso.", "Buenazo, avísame si cambia la hora.", "Recuerda llevar tu carné para el ingreso."] },

    { id: "diego", name: "Diego Luna", verified: true, status: "en línea",
      msgs: [
        { from: "in",  t: "11:02", text: "¿Ya viste el grupo de estudio de IHC y Tecnologías Móviles?" },
        { from: "out", t: "11:04", text: "Sí, me uní ayer. Somos 6 por ahora." },
        { from: "in",  t: "11:05", text: "Estamos revisando las heurísticas de Nielsen para la validación. ¿Armamos una sesión el jueves?" },
        { from: "out", t: "11:06", text: "Dale. ¿A qué hora estás libre?" },
        { from: "in",  t: "11:08", text: "En Libres ahora aparezco disponible de 2 a 4 p. m. Te propongo ahí el plan de estudio." },
        { from: "out", t: "11:09", text: "Te lo envío ahora: biblioteca, piso 2." },
        { from: "in",  t: "11:10", text: "Acepto. Llevo el prototipo de Figma para revisarlo juntos." }
      ],
      replies: ["Ok, anotado.", "Yo llevo las capturas del formulario.", "¿Le avisamos al resto del grupo?", "Perfecto, así avanzamos con el capítulo 6."] },

    { id: "williams", name: "Williams Ascanoa", verified: true, status: "hace 12 min",
      msgs: [
        { from: "in",  t: "08:40", text: "Brayan, ¿conoces alguna pensión segura por Pueblo Libre? Recién llegué de Piura." },
        { from: "out", t: "08:43", text: "En la Guía segura de NexoU hay pensiones y rutas verificadas por la universidad. Revísalas." },
        { from: "in",  t: "08:45", text: "Justo estaba viendo eso. Guardé dos cerca de la línea 1 del metro." },
        { from: "out", t: "08:47", text: "Bien. Fíjate en las valoraciones y que figuren como verificadas." },
        { from: "in",  t: "08:50", text: "Gracias, qué alivio. En mi ciudad casi todo era por recomendación de conocidos." }
      ],
      replies: ["Gracias por la ayuda.", "Mañana voy a ver una de las pensiones.", "Voy a guardar esa ruta en la guía."] },

    { id: "joaquin", name: "Joaquín Sánchez", verified: false, status: "en línea",
      msgs: [
        { from: "in",  t: "13:20", text: "Hola Brayan, estamos armando un torneo de ajedrez interfacultades para el viernes." },
        { from: "out", t: "13:22", text: "Qué bueno. ¿Dónde sería?" },
        { from: "in",  t: "13:23", text: "En el patio del pabellón B a las 5 p. m. Hay 16 cupos." },
        { from: "out", t: "13:25", text: "Me apunto. ¿Puedo invitar a otro compañero?" },
        { from: "in",  t: "13:28", text: "Genial. Si quieres, crea el evento desde “+ Crear evento” para que aparezca en la lista." }
      ],
      replies: ["Dale, lo publicamos hoy.", "Ya quedan 9 cupos.", "Va a estar bacán, ya hay varios inscritos."] },

    { id: "hyogo", name: "Hyogo", verified: true, status: "en línea",
      msgs: [
        { from: "in",  t: "10:05", text: "Hola Brayan. Soy Hyogo, estudiante de intercambio desde Japón. Me asignaron contigo como buddy." },
        { from: "out", t: "10:07", text: "¡Hola Hyogo! Bienvenido a Lima. Cualquier duda del campus o de la ciudad me dices." },
        { from: "in",  t: "10:13", text: "Perfecto. También quiero unirme a un grupo de hobbies. Me gusta la fotografía." },
        { from: "out", t: "10:15", text: "Hay uno de fotografía los sábados. Te envío el enlace del grupo." },
        { from: "in",  t: "10:18", text: "Muchas gracias. ¿Puedo valorar tu ayuda en la app después?" }
      ],
      replies: ["Entendido, gracias.", "Mañana llego temprano al campus.", "Quisiera conocer la biblioteca."] }
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
  const userIcon = '<svg class="ico"><use href="#i-user"/></svg>';
  const now = () => new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false });

  let activeId = chats[0].id;
  let filter = "";

  const byId = id => chats.find(c => c.id === id);
  const last = c => c.msgs[c.msgs.length - 1];
  const preview = c => { const m = last(c); return m ? (m.from === "out" ? "Tú: " : "") + m.text : ""; };

  function avatar(size) {
    return el("span", "avatar" + (size ? " avatar--" + size : ""), userIcon);
  }

  function renderList() {
    const ul = $("#chatList");
    ul.innerHTML = "";
    const list = chats.filter(c => c.name.toLowerCase().includes(filter));
    $("#chatEmpty").hidden = list.length > 0;
    list.forEach(c => {
      const li = el("li", c.id === activeId ? "is-active" : "");
      const b = el("button");
      b.type = "button";
      const meta = el("span", "chat-list__meta");
      meta.append(el("span", "chat-list__name", c.name), el("span", "chat-list__preview"));
      meta.lastChild.textContent = preview(c);
      b.append(avatar(), meta);
      b.onclick = () => openChat(c.id);
      li.append(b);
      ul.append(li);
    });
  }

  function renderHead(c) {
    const h = $("#chatHead");
    h.innerHTML = "";
    const who = el("div", "chat__who");
    const name = el("span", "chat__name");
    name.append(document.createTextNode(c.name));
    if (c.verified) name.append(el("span", "badge", '<svg><use href="#i-check"/></svg>'));
    who.append(name, el("span", "chat__status", c.status));
    h.append(avatar("md"), who);
  }

  function bubble(m) {
    const row = el("div", "msg msg--" + m.from);
    if (m.from === "in") row.append(avatar("xs"));
    const b = el("div", "msg__bubble");
    b.append(document.createTextNode(m.text));
    const t = el("span", "msg__time");
    t.textContent = m.t;
    b.append(t);
    row.append(b);
    return row;
  }

  function renderMessages(c) {
    const body = $("#chatBody");
    body.innerHTML = "";
    body.append(el("div", "day", "Hoy"));
    c.msgs.forEach(m => body.append(bubble(m)));
    body.scrollTop = body.scrollHeight;
  }

  function openChat(id) {
    activeId = id;
    const c = byId(id);
    if (!c) return;
    renderHead(c);
    renderMessages(c);
    renderList();
  }

  let typingTimer;
  $("#chatForm").addEventListener("submit", e => {
    e.preventDefault();
    const input = $("#chatInput");
    const text = input.value.trim();
    if (!text) return;
    const c = byId(activeId);
    c.msgs.push({ from: "out", t: now(), text });
    input.value = "";
    renderMessages(c);
    renderList();

    clearTimeout(typingTimer);
    const body = $("#chatBody");
    const tip = el("div", "typing", c.name.split(" ")[0] + " está escribiendo...");
    body.append(tip);
    body.scrollTop = body.scrollHeight;

    const chatId = c.id;
    typingTimer = setTimeout(() => {
      const r = c.replies[Math.floor(Math.random() * c.replies.length)];
      c.msgs.push({ from: "in", t: now(), text: r });
      if (activeId === chatId) renderMessages(c);
      renderList();
    }, 1200);
  });

  // Conectar amigos del sidebar con el chat correspondiente
  document.querySelectorAll("#nx-sidebar-friends li").forEach((li, idx) => {
    li.addEventListener("click", () => {
      if (typeof window.nxNavigateTo === "function") window.nxNavigateTo("chats");
      if (chats[idx]) openChat(chats[idx].id);
    });
  });

  openChat(activeId);
})();