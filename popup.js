document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('start-btn').addEventListener('click', startAutomation);
document.getElementById('product').addEventListener('change', (e) => {
  updateUI(e.target);
  saveOptions();
});
document.getElementById('serials').addEventListener('input', saveOptions);
document.getElementById('quantity').addEventListener('input', saveOptions);

function updateUI(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const isONU = selectedOption.getAttribute('data-type') === 'onu';

  const serialsGroup = document.getElementById('serials-group');
  const quantityGroup = document.getElementById('quantity-group');

  if (isONU) {
    serialsGroup.classList.remove('hidden');
    quantityGroup.classList.add('hidden');
  } else {
    serialsGroup.classList.add('hidden');
    quantityGroup.classList.remove('hidden');
  }
}

function saveOptions() {
  const productId = document.getElementById('product').value;
  const serialsText = document.getElementById('serials').value;
  const quantity = document.getElementById('quantity').value;

  chrome.storage.local.set({
    productId: productId,
    serials: serialsText,
    quantity: quantity
  });
}

function restoreOptions() {
  chrome.storage.local.get(['productId', 'serials', 'quantity'], (items) => {
    if (items.productId) {
      document.getElementById('product').value = items.productId;
    }
    if (items.serials) {
      document.getElementById('serials').value = items.serials;
    }
    if (items.quantity) {
      document.getElementById('quantity').value = items.quantity;
    }

    // Update UI based on loaded (or default) product
    updateUI(document.getElementById('product'));
  });
}

async function startAutomation() {
  const productSelect = document.getElementById('product');
  const productId = productSelect.value;
  const selectedOption = productSelect.options[productSelect.selectedIndex];
  const isONU = selectedOption.getAttribute('data-type') === 'onu';

  const statusDiv = document.getElementById('status');
  statusDiv.textContent = 'Iniciando...';
  statusDiv.className = 'status-info';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url.includes('virtustelecom.app.br/movimentos/create')) {
    statusDiv.textContent = 'Erro: Você não está na página correta.';
    statusDiv.className = 'status-error';
    return;
  }

  let message = {
    action: 'process_serials', // Default action name, handles both
    productId: productId,
    mode: isONU ? 'onu' : 'quantity'
  };

  if (isONU) {
    const serialsText = document.getElementById('serials').value;
    const serials = serialsText.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    if (serials.length === 0) {
      statusDiv.textContent = 'Por favor, insira pelo menos um serial.';
      statusDiv.className = 'status-error';
      return;
    }
    message.serials = serials;
  } else {
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    if (!quantity || quantity < 1) {
      statusDiv.textContent = 'Quantidade inválida.';
      statusDiv.className = 'status-error';
      return;
    }
    message.quantity = quantity;
  }

  try {
    const response = await chrome.tabs.sendMessage(tab.id, message);

    if (response && response.status === 'started') {
      statusDiv.textContent = 'Automação iniciada!';
      statusDiv.className = 'status-success';
    } else {
      statusDiv.textContent = 'Erro ao iniciar automação.';
      statusDiv.className = 'status-error';
    }
  } catch (error) {
    console.error(error);
    statusDiv.textContent = 'Erro de comunicação. Recarregue a página.';
    statusDiv.className = 'status-error';
  }
}
