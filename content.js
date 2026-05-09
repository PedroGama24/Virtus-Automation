chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'process_serials') {
        if (request.mode === 'onu') {
            processSerials(request.productId, request.serials);
        } else {
            processQuantity(request.productId, request.quantity);
        }
        sendResponse({ status: 'started' });
    }
    return true;
});

async function processSerials(productId, serials) {
    const addButton = document.getElementById('adicionar-linha');

    if (!addButton) {
        console.error('Botão "Adicionar Item" não encontrado.');
        alert('Erro: Botão "Adicionar Item" não encontrado na página.');
        return;
    }

    // Determine start index based on existing rows
    let allProductSelects = document.querySelectorAll('select[name$="[produto_id]"]');
    let startIndex = -1;

    // Find first empty row
    for (let j = 0; j < allProductSelects.length; j++) {
        if (allProductSelects[j].value === "" || allProductSelects[j].value === "0") {
            startIndex = j;
            break;
        }
    }

    // If no empty row, start after the last one
    if (startIndex === -1) {
        startIndex = allProductSelects.length;
    }

    for (let i = 0; i < serials.length; i++) {
        const serial = serials[i];
        const currentIndex = startIndex + i;

        // Refresh list to check if we need to add a row
        allProductSelects = document.querySelectorAll('select[name$="[produto_id]"]');
        let allSerialInputs = document.querySelectorAll('input[name$="[numero_serie]"]');

        // If our target index is beyond existing rows, add new row
        if (currentIndex >= allProductSelects.length) {
            addButton.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            // Refresh again
            allProductSelects = document.querySelectorAll('select[name$="[produto_id]"]');
            allSerialInputs = document.querySelectorAll('input[name$="[numero_serie]"]');
        }

        if (currentIndex < allProductSelects.length && currentIndex < allSerialInputs.length) {
            const targetProductSelect = allProductSelects[currentIndex];
            const targetSerialInput = allSerialInputs[currentIndex];

            targetProductSelect.value = productId;
            targetProductSelect.dispatchEvent(new Event('change', { bubbles: true }));

            targetSerialInput.value = serial;
            targetSerialInput.dispatchEvent(new Event('input', { bubbles: true }));

            console.log(`Linha ${currentIndex + 1} preenchida: Serial ${serial}`);
        } else {
            console.error(`Erro ao encontrar a linha ${currentIndex + 1}.`);
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    alert('Automação de ONUs concluída!');
}

async function processQuantity(productId, quantity) {
    const addButton = document.getElementById('adicionar-linha');

    if (!addButton) {
        console.error('Botão "Adicionar Item" não encontrado.');
        alert('Erro: Botão "Adicionar Item" não encontrado.');
        return;
    }

    // Determine target index
    let allProductSelects = document.querySelectorAll('select[name$="[produto_id]"]');
    let targetIndex = -1;

    // Find first empty row
    for (let j = 0; j < allProductSelects.length; j++) {
        if (allProductSelects[j].value === "" || allProductSelects[j].value === "0") {
            targetIndex = j;
            break;
        }
    }

    // If no empty row, add new one
    if (targetIndex === -1) {
        addButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        // Refresh
        allProductSelects = document.querySelectorAll('select[name$="[produto_id]"]');
        targetIndex = allProductSelects.length - 1;
    }

    if (targetIndex >= 0) {
        const allQuantityInputs = document.querySelectorAll('input[name$="[quantidade]"]');
        // Refresh selects
        allProductSelects = document.querySelectorAll('select[name$="[produto_id]"]');

        const targetProductSelect = allProductSelects[targetIndex];
        const targetQuantityInput = allQuantityInputs[targetIndex];

        if (targetProductSelect && targetQuantityInput) {
            targetProductSelect.value = productId;
            targetProductSelect.dispatchEvent(new Event('change', { bubbles: true }));

            console.log(`Produto ${productId} selecionado na linha ${targetIndex + 1}.`);

            await new Promise(resolve => setTimeout(resolve, 800));

            if (targetQuantityInput.disabled) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            targetQuantityInput.value = quantity;
            targetQuantityInput.dispatchEvent(new Event('input', { bubbles: true }));
            targetQuantityInput.dispatchEvent(new Event('change', { bubbles: true }));
            targetQuantityInput.dispatchEvent(new Event('blur', { bubbles: true }));

            console.log(`Quantidade ${quantity} definida para linha ${targetIndex + 1}`);
        } else {
            console.error('Erro ao encontrar campos para o novo item.');
        }
    }
}
