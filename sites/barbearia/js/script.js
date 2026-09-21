const NUMERO_WHATSAPP = "5562994683562"; // troque pelo número real da barbearia

const servicoSelect = document.getElementById("clienteServico");
const precoEl = document.getElementById("orderPreco");

function atualizarPreco() {
  const opt = servicoSelect.options[servicoSelect.selectedIndex];
  const preco = opt && opt.dataset.preco ? opt.dataset.preco : 0;
  precoEl.textContent = `R$ ${preco}`;
}
servicoSelect.addEventListener("change", atualizarPreco);

const form = document.getElementById("orderForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("clienteNome").value.trim();
  const opt = servicoSelect.options[servicoSelect.selectedIndex];
  const servico = opt.value;
  const preco = opt.dataset.preco;
  const horario = document.getElementById("clienteHorario").value;
  const obs = document.getElementById("clienteObs").value.trim();

  if (!nome || !servico || !horario) return;

  let mensagem = `*Novo pedido — Fio & Navalha*\n\n`;
  mensagem += `Cliente: ${nome}\n`;
  mensagem += `Serviço: ${servico}\n`;
  mensagem += `Valor: R$ ${preco}\n`;
  mensagem += `Horário desejado: ${horario}\n`;
  mensagem += `Tempo estimado: 60 minutos\n`;
  if (obs) mensagem += `Observações: ${obs}\n`;
  mensagem += `\n(Pedido de demonstração enviado pelo site exemplo)`;

  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
});
