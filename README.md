# RobotMario-AI

Editor visual de fases para navegador, com geração procedural offline e importação/exportação JSON.

> Status: protótipo inicial. O JSON é formato próprio deste editor; compatibilidade com `.swe` ainda não foi implementada nem confirmada.

## Como usar
Abra `index.html` no navegador. Clique nas peças da paleta para editar, use **Gerar fase** para criar uma fase procedural e **Exportar JSON** para salvar o projeto.

## Próximos passos
- Analisar os arquivos locais do SMM:WE com REA.
- Confirmar formato real das fases e funções de importação/exportação.
- Verificar a licença da referência antes de reutilizar código ou recursos.

Referência para investigação: https://github.com/yohexp/smmwe3.4.2F-sc


## IA online (Groq, xAI/Grok e OpenAI)

Na seção **Escolha sua inteligência artificial**, selecione o provedor, informe o nome do modelo e cole sua própria API key. A chamada é feita do navegador diretamente para o endpoint do provedor. O RobotMario-AI não grava a chave no repositório; ainda assim, use apenas chaves pessoais de baixo risco, nunca em computador compartilhado, e revogue a chave se suspeitar de exposição. O uso pode gerar cobranças ou consumir limites da sua conta. Os modelos e permissões disponíveis dependem da conta do provedor.

## Conversor .swe experimental

A seção **Conversor JSON ↔ .swe** implementa o processo do snippet fornecido: compactar JSON, codificar em Base64 UTF-8, calcular HMAC-SHA1 e anexar a assinatura hexadecimal. A importação decodifica o payload removendo os 40 últimos caracteres, como no snippet; ela não verifica a assinatura. A compatibilidade do formato, da chave de assinatura e dos campos com a versão instalada do SMM:WE não está confirmada. Faça backup e teste em uma cópia. O arquivo .swe pode conter campos específicos que precisam ser descobertos por análise real do jogo.

### Limitações
- A IA gera a grade do protótipo RobotMario-AI, não necessariamente um layout válido para o SMM:WE.
- O acesso direto a APIs pode ser bloqueado por CORS ou políticas do provedor; nesse caso, será necessário um backend privado.
- Não coloque chaves de API em arquivos HTML/JS nem em commits públicos.
