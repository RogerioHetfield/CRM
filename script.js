let leads = JSON.parse(localStorage.getItem("leads")) || [];
let dragId = null;

function salvar() {
  localStorage.setItem("leads", JSON.stringify(leads));
}

function abrirModal() {
  document.getElementById("modal").style.display = "block";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

function addLead() {
  const nome = document.getElementById("nome").value.trim();
  const tipo = document.getElementById("tipo").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const followup = document.getElementById("followup").value;

  if (!nome || !telefone) {
    alert("Preencha nome e WhatsApp");
    return;
  }

  leads.push({
    id: Date.now(),
    nome,
    tipo,
    telefone,
    followup,
    status: "Não contatado"
  });

  salvar();
  fecharModal();
  render();

  document.getElementById("nome").value = "";
  document.getElementById("tipo").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("followup").value = "";
}

function render() {
  document.querySelectorAll(".dropzone").forEach(d => d.innerHTML = "");

  const busca = document.getElementById("busca").value.toLowerCase();

  leads
    .filter(l => l.nome.toLowerCase().includes(busca))
    .forEach(l => {
      const el = document.createElement("div");
      el.className = "card";
      el.draggable = true;

      el.innerHTML = `
        <strong>${l.nome}</strong><br>
        ${l.tipo}<br>
        ${l.telefone}<br>
        <small>⏰ ${l.followup || "-"}</small><br>
        <button onclick="abrirWhats('${l.telefone}')">WhatsApp</button>
      `;

      el.ondragstart = () => dragId = l.id;

      document.getElementById(getColuna(l.status)).appendChild(el);
    });
}

function getColuna(status) {
  if (status === "Não contatado") return "nao";
  if (status === "Chamado") return "chamado";
  if (status === "Interessado") return "interessado";
  if (status === "Fechado") return "fechado";
}

document.querySelectorAll(".dropzone").forEach(zone => {
  zone.ondragover = e => e.preventDefault();

  zone.ondrop = () => {
    const status = zone.parentElement.dataset.status;
    leads = leads.map(l => l.id === dragId ? {...l, status} : l);
    salvar();
    render();
  };
});

function abrirWhats(num) {
  window.location.href = `https://wa.me/${num}`;
}

function toggleDark() {
  document.body.classList.toggle("dark");
}

render();