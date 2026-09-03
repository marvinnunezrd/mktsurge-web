// MKT Surge — formulario de contacto del sitio público.
// Escribe directamente en la colección "leads" del mismo proyecto de Firebase
// que usa MKT Surge OS (mkt-surge-crm), así el lead entra al pipeline sin que
// nadie tenga que transcribirlo a mano desde un correo o WhatsApp.
//
// El objeto firebaseConfig no es secreto — está protegido por la regla de
// seguridad de Firestore (solo permite "create" con datos válidos, nunca leer
// ni modificar nada), no por ocultar estos valores.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHBxHvEn4r6lrwXAA4-v51moazcR0edKo",
  authDomain: "mkt-surge-crm.firebaseapp.com",
  projectId: "mkt-surge-crm",
  storageBucket: "mkt-surge-crm.firebasestorage.app",
  messagingSenderId: "286597522649",
  appId: "1:286597522649:web:cd6b5424ddcaf874d5cac8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Escapa texto libre antes de meterlo en el HTML del correo de aviso, para
// que un nombre/notas con "<" o "&" no rompan el formato del mensaje.
function esc(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}

// Textos del formulario según el idioma de la página (<html lang="...">), para
// que las páginas en /en/ muestren sus mensajes en inglés sin duplicar este
// archivo — el resto de la lógica (Firestore, honeypot, etc.) es igual en los
// dos idiomas.
const LANG = document.documentElement.lang === "en" ? "en" : "es";
const STR = {
  es: {
    missing: "Escribe tu nombre y un teléfono o correo para contactarte.",
    sending: "Enviando…",
    send: "Enviar",
    ok: "¡Listo! Recibimos tu mensaje — te contactamos muy pronto.",
    err: "No pudimos enviar el formulario. Escríbenos por WhatsApp o a hola@mktsurge.com."
  },
  en: {
    missing: "Enter your name and a phone number or email so we can reach you.",
    sending: "Sending…",
    send: "Send",
    ok: "Done! We got your message — we'll be in touch soon.",
    err: "We couldn't send the form. Message us on WhatsApp or at hola@mktsurge.com."
  }
}[LANG];

const form = document.getElementById("lead-form");
if (form) {
  // Si llegaron desde el catálogo con un servicio específico ("Solicitar este
  // servicio"), lo preseleccionamos en el formulario.
  try {
    const params = new URLSearchParams(location.search);
    const preselect = params.get("service");
    if (preselect && form.service) {
      const opt = Array.from(form.service.options).find(o => o.value === preselect);
      if (opt) form.service.value = preselect;
    }
  } catch (e) { /* no bloquea el formulario si algo aquí falla */ }

  const msg = document.getElementById("lead-form-msg");
  const submitBtn = document.getElementById("lead-form-submit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.className = "lead-form-msg";

    const name = form.name.value.trim();
    const contact = form.contact.value.trim();
    const service = form.service.value;
    const notes = form.notes.value.trim();
    const honeypot = form.company.value.trim();

    if (honeypot) return; // relleno solo por bots — se ignora en silencio

    if (!name || !contact) {
      msg.textContent = STR.missing;
      msg.className = "lead-form-msg err";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = STR.sending;
    try {
      await addDoc(collection(db, "leads"), {
        name,
        contact,
        services: service ? [service] : [],
        service: service || "",
        value: null,
        notes,
        clientId: null,
        stage: "nuevo",
        source: "sitio-publico",
        page: location.pathname,
        honeypot: "",
        createdByUid: null,
        createdAt: serverTimestamp()
      });
      form.reset();
      msg.textContent = STR.ok;
      msg.className = "lead-form-msg ok";

      // Aviso por correo de que llegó un lead nuevo (vía la extensión "Trigger
      // Email" de Firebase, que envía un correo por cada documento creado en
      // la colección "mail"). Si esto falla no afecta al visitante — el lead
      // ya quedó guardado y visible en el Pipeline de todos modos.
      try {
        await addDoc(collection(db, "mail"), {
          to: ["marvin@mktsurge.com"],
          message: {
            subject: `Nuevo lead: ${name}`,
            html: `<p><b>Nuevo lead desde mktsurge.com</b></p>
<p><b>Nombre:</b> ${esc(name)}<br>
<b>Contacto:</b> ${esc(contact)}<br>
<b>Servicio de interés:</b> ${esc(service || "(sin especificar)")}<br>
<b>Notas:</b> ${esc(notes || "(sin notas)")}<br>
<b>Página:</b> ${esc(location.pathname)}</p>
<p>Entra al CRM (Pipeline) para verlo y darle seguimiento.</p>`
          },
          createdAt: serverTimestamp()
        });
      } catch (mailErr) {
        console.error("[lead-form] no se pudo encolar el correo de aviso:", mailErr);
      }
    } catch (err) {
      console.error("[lead-form] error al enviar:", err);
      msg.textContent = STR.err;
      msg.className = "lead-form-msg err";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = STR.send;
    }
  });
}
