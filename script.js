let leads = JSON.parse(localStorage.getItem("leads")) || [];

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
  const nome = document.getElementById("nome").value;
  const tipo = document.getElementById("tipo").value;
  const telefone = document.getElementById("telefone").value;

  leads.push({
    id: Date.now(),
    nome,
    tipo,
    telefone,
    status: "Não contatado",
  });

  salvar();
  fecharModal();
  render();
}

function mudarStatus(id, status) {
  leads = leads.map((l) => (l.id === id ? { ...l, status } : l));
  salvar();
  render();
}

function deletar(id) {
  leads = leads.filter((l) => l.id !== id);
  salvar();
  render();
}

function abrirWhats(telefone) {
  window.open(`https://wa.me/${telefone}`);
}

function render() {
  const lista = document.getElementById("lista");

  let interessados = 0;
  let fechados = 0;

  lista.innerHTML = "";

  leads.forEach((l) => {
    if (l.status === "Interessado") interessados++;
    if (l.status === "Fechado") fechados++;

    let classe = "";
    if (l.status === "Não contatado") classe = "nao";
    if (l.status === "Chamado") classe = "chamado";
    if (l.status === "Interessado") classe = "interessado";
    if (l.status === "Fechado") classe = "fechado";

    lista.innerHTML += `
      <div class="card">
        <strong>${l.nome}</strong><br>
        ${l.tipo}<br>
        ${l.telefone}<br>

        <div class="status ${classe}">${l.status}</div>

        <div>
          <select onchange="mudarStatus(${l.id}, this.value)">
            <option ${
              l.status === "Não contatado" ? "selected" : ""
            }>Não contatado</option>
            <option ${l.status === "Chamado" ? "selected" : ""}>Chamado</option>
            <option ${
              l.status === "Interessado" ? "selected" : ""
            }>Interessado</option>
            <option ${l.status === "Fechado" ? "selected" : ""}>Fechado</option>
          </select>
          <button class="excluir" onclick="deletar(${l.id})">Excluir</button>
        </div>
      </div>
    `;
  });

  document.getElementById("total").innerText = leads.length;
  document.getElementById("interessados").innerText = interessados;
  document.getElementById("fechados").innerText = fechados;
}

render();
