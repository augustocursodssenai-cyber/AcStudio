const NUMERO_WHATSAPP = "5562994683562"; // troque pelo número real da loja

const tamanhoSelect = document.getElementById("tamanho");
const checkboxes = document.querySelectorAll('.toppings input[type="checkbox"]');
const sumToppings = document.getElementById("sumToppings");
const orderTotal = document.getElementById("orderTotal");

function calcularTotal() {
  const tamanhoOpt = tamanhoSelect.options[tamanhoSelect.selectedIndex];
  let total = tamanhoOpt && tamanhoOpt.dataset.preco ? Number(tamanhoOpt.dataset.preco) : 0;

  const escolhidos = [];
  checkboxes.forEach((cb) => {
    if (cb.checked) {
      total += Number(cb.dataset.preco);
      escolhidos.push(cb.value);
    }
  });

  sumToppings.textContent = escolhidos.length ? escolhidos.join(", ") : "nenhum";
  orderTotal.textContent = `R$ ${total}`;
  return { total, escolhidos };
}

tamanhoSelect.addEventListener("change", calcularTotal);
checkboxes.forEach((cb) => cb.addEventListener("change", calcularTotal));
calcularTotal();

const form = document.getElementById("orderForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("clienteNome").value.trim();
  const tamanhoOpt = tamanhoSelect.options[tamanhoSelect.selectedIndex];
  const tamanho = tamanhoOpt.value;
  const pagamento = document.getElementById("pagamento").value;
  const { total, escolhidos } = calcularTotal();

  if (!nome || !tamanho) return;

  let mensagem = `*Novo pedido — Açaí da Vila*\n\n`;
  mensagem += `Cliente: ${nome}\n`;
  mensagem += `Tamanho: ${tamanho}\n`;
  mensagem += `Complementos: ${escolhidos.length ? escolhidos.join(", ") : "nenhum"}\n`;
  mensagem += `Forma de pagamento: ${pagamento}\n`;
  mensagem += `Valor total: R$ ${total}\n`;
  mensagem += `Tempo estimado: 60 minutos\n`;
  mensagem += `\n(Pedido de demonstração enviado pelo site exemplo)`;

  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
});
