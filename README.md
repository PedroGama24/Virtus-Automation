# Virtus Telecom Automation Extension

## Instalação

1.  Abra o Google Chrome e navegue para `chrome://extensions`.
2.  No canto superior direito, ative o **Modo do desenvolvedor** (Developer mode).
3.  Clique no botão **Carregar sem compactação** (Load unpacked).
4.  Selecione a pasta `virtus_extension` deste projeto.

## Como Usar

1.  Acesse a página de movimentação do Virtus: [https://virtustelecom.app.br/movimentos/create](https://virtustelecom.app.br/movimentos/create).
2.  Clique no ícone da extensão na barra de ferramentas do Chrome.
3.  Selecione o **Produto** desejado na lista.
4.  Cole a lista de **Seriais (ONUs)** na área de texto (um por linha).
5.  Clique em **Iniciar Automação**.

A extensão irá clicar automaticamente no botão "Adicionar Item" para cada serial e preencher as informações.

## Notas
-   Certifique-se de estar na página correta antes de iniciar.
-   A automação insere um pequeno intervalo entre as ações para garantir que o sistema processe cada linha.
