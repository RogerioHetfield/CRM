let leads = JSON.parse(localStorage.getItem("elite_leads_db")) || [];

// Abrir e fechar Modal
function openModal() {
    document.getElementById("modal-overlay").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal-overlay").style.display = "none";
    clearForm();
}

function clearForm() {
    document.getElementById("edit-id").value = "";
    document.getElementById("lead-name").value = "";
    document.getElementById("lead-phone").value = "";
    document.getElementById("lead-status").value = "novo";
    document.getElementById("lead-notes").value = "";
    document.getElementById("modal-title").innerText = "Novo Estabelecimento";
}

// Salvar ou Atualizar
function handleSave() {
    const id = document.getElementById("edit-id").value;
    const name = document.getElementById("lead-name").value;
    const phone = document.getElementById("lead-phone").value;
    const status = document.getElementById("lead-status").value;
    const notes = document.getElementById("lead-notes").value;

    if (!name || !phone) return alert("Preencha Nome e Telefone!");

    if (id) {
        const index = leads.findIndex((l) => l.id == id);
        leads[index] = { ...leads[index], name, phone, status, notes };
    } else {
        leads.push({ id: Date.now(), name, phone, status, notes });
    }

    saveAndRender();
    closeModal();
}

// Editar
function editLead(id) {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;

    document.getElementById("edit-id").value = lead.id;
    document.getElementById("lead-name").value = lead.name;
    document.getElementById("lead-phone").value = lead.phone;
    document.getElementById("lead-status").value = lead.status;
    document.getElementById("lead-notes").value = lead.notes;

    document.getElementById("modal-title").innerText = "Editar Lead";
    openModal();
}

// Deletar
function deleteLead(id) {
    if (confirm("Remover este lead?")) {
        leads = leads.filter((l) => l.id !== id);
        saveAndRender();
    }
}

// Relatório Dinâmico
function toggleReport() {
    const panel = document.getElementById("report-panel");
    const isVisible = panel.style.display === "block";

    panel.style.display = isVisible ? "none" : "block";

    if (!isVisible) {
        const total = leads.length;
        const closed = leads.filter((l) => l.status === "fechado").length;
        const rate = total > 0 ? Math.round((closed / total) * 100) : 0;

        setTimeout(() => {
            document.getElementById("progress-bar").style.width = rate + "%";
            document.getElementById("rate-value").innerText = rate + "% de Conversão";
        }, 100);
    }
}

function saveAndRender() {
    localStorage.setItem("elite_leads_db", JSON.stringify(leads));
    render();
}

function render() {
    const container = document.getElementById("leads-container");
    container.innerHTML = "";

    let closed = 0;
    let open = 0;

    leads.forEach((lead) => {
        if (lead.status === "fechado") closed++;
        else open++;

        const cleanPhone = lead.phone.replace(/\D/g, "");
        const card = document.createElement("div");
        card.className = "lead-card";
        card.innerHTML = `
            <span class="status-tag tag-${lead.status}">${lead.status}</span>
            <h3>${lead.name}</h3>
            <p style="font-size: 0.85rem; color: #64748b; margin-top: 5px;">${lead.notes || "Sem observações."
            }</p>
            <a href="https://wa.me/55${cleanPhone}" target="_blank" class="lead-phone mobile-touch">
    <i class="ri-whatsapp-fill"></i> Chamar no WhatsApp
</a>
            <div class="actions">
                <button class="btn-icon" onclick="editLead(${lead.id
            })"><i class="ri-edit-line"></i></button>
                <button class="btn-icon" onclick="deleteLead(${lead.id
            })" style="color: #ef4444;"><i class="ri-delete-bin-line"></i></button>
            </div>
        `;
        container.appendChild(card);
    });

    document.getElementById("count-total").innerText = leads.length;
    document.getElementById("count-closed").innerText = closed;
    document.getElementById("count-open").innerText = open;
}

render();
