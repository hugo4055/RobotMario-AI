# Investigação REA — SMM:WE

Objetivo: descobrir, sem modificar o jogo instalado, como o SMM:WE guarda, carrega e representa fases, para avaliar uma integração real com o RobotMario-AI.

## Caminhos de referência
- Instalação local informada: `C:\Program Files (x86)\SMMWE`
- Repositório público de referência: https://github.com/yohexp/smmwe3.4.2F-sc

## Instruções para OpenCode + REA

1. Faça primeiro um inventário de arquivos e pastas, tamanho, extensões, executáveis, bibliotecas e recursos. Não apague, mova nem edite arquivos originais.
2. Identifique a tecnologia, a linguagem, o sistema de build e a licença do código-fonte. Verifique o arquivo de licença real no repositório e as licenças de recursos separadamente. Não presuma que um repositório público permite reutilização.
3. Procure referências a salvar, carregar, importar, exportar, nível, fase, mapa, serialização, JSON, XML, binário e extensão `.swe`. Registre caminhos e linhas relevantes.
4. Trace o fluxo real de salvar e carregar uma fase: classes, métodos, estruturas de dados e validações. Se não conseguir provar um detalhe, marque como hipótese e descreva como confirmar.
5. Compare o formato de arquivo observado com um arquivo de fase criado pelo próprio jogo, se houver um exemplo obtido legitimamente. Não invente a estrutura de `.swe` e não sobrescreva saves.
6. Produza `RELATORIO-ANALISE-SMMWE.md` com: inventário, tecnologia, licença, formato confirmado, fluxo de importação/exportação, limitações, evidências (caminho + linha) e plano de integração.
7. Não copie código ou recursos para este projeto antes de confirmar as licenças e a compatibilidade. Não execute arquivos desconhecidos nem altere o jogo instalado.

## Critério de conclusão

A compatibilidade só pode ser marcada como confirmada quando houver evidência do formato real e um teste de ida e volta feito com cópia de uma fase de teste. Até lá, o editor salva apenas o seu próprio JSON.
