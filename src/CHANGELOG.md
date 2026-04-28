# Refúgio - Changelog

## v1.0-realtime - 28/04/2026
### ✅ Funcionalidades estáveis
- Envio anônimo de desabafos
- Contador de orações global
- Versículo aleatório ao orar
- Mural com Realtime Supabase
- Delete em tempo real pelo pastor
- Área do pastor com código CODIGO-PASTOR-2025

### 🔧 Config Supabase
- RLS: SELECT liberado pra anon
- Policy: DELETE liberado pra anon (só pra broadcast)
- Publications: tabela desabafos no supabase_realtime
- Channel: postgres_changes event * funcionando

### 📦 Próximas features
1. Notificação "Alguém orou por você"
2. Versículo do Dia editável pelo pastor  
3. Moderação com IA antes de publicar