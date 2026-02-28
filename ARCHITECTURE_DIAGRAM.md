# Diagrama de Arquitetura - MindEase Clean Architecture

## 🏛️ Visão Geral das Camadas

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    🖼️  UI LAYER (React)                      ┃
┃                   app/components/                            ┃
┃  TaskBoard.tsx   ProfilePage.tsx   FocusTimerPage.tsx       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                          │ usa (importa e chama)
                          ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃              🎨 PRESENTATION LAYER (Hooks)                   ┃
┃                  presentation/hooks/                         ┃
┃                                                              ┃
┃  useTasks()           useUserPreferences()                  ┃
┃  useFocusSession()                                          ┃
┃                                                              ┃
┃  - Gerencia estado da UI (loading, error, data)             ┃
┃  - Encapsula chamadas aos Use Cases                         ┃
┃  - Fornece interface limpa para componentes                 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                          │ chama através do
                          │ DI Container
                          ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃            🎪 APPLICATION LAYER (Use Cases)                  ┃
┃                 application/usecases/                        ┃
┃                                                              ┃
┃  CreateTaskUseCase        ManageUserPreferencesUseCase     ┃
┃  UpdateTaskUseCase        ManageFocusSessionUseCase        ┃
┃  MoveTaskUseCase                                            ┃
┃  ToggleChecklistItemUseCase                                 ┃
┃  DeleteTaskUseCase                                          ┃
┃  ListTasksUseCase                                           ┃
┃                                                              ┃
┃  - Orquestra regras de negócio                              ┃
┃  - Valida dados de entrada                                  ┃
┃  - Independente de UI e Framework                           ┃
┃  - Usa interfaces (não implementações)                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                          │ depende de (interfaces)
                          ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃              🎯 DOMAIN LAYER (Núcleo)                        ┃
┃                     domain/                                  ┃
┃                                                              ┃
┃  ┌─────────────────────┐   ┌──────────────────────┐        ┃
┃  │   ENTITIES          │   │   INTERFACES         │        ┃
┃  │   entities/         │   │   repositories/      │        ┃
┃  │                     │   │                      │        ┃
┃  │  • Task             │   │  • ITaskRepository   │        ┃
┃  │  • UserPreferences  │   │  • IUserPreferences  │        ┃
┃  │  • FocusSession     │   │    Repository         │        ┃
┃  │                     │   │  • IFocusSession     │        ┃
┃  │  Regras de negócio  │   │    Repository         │        ┃
┃  │  encapsuladas       │   │                      │        ┃
┃  │                     │   │  Contratos/Portas    │        ┃
┃  └─────────────────────┘   └──────────────────────┘        ┃
┃                                                              ┃
┃  - Zero dependências externas                               ┃
┃  - Lógica de negócio pura                                   ┃
┃  - Centro da aplicação                                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                          ▲ implementado por
                          │
┏━━━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃          🔌 INFRASTRUCTURE LAYER (Adaptadores)               ┃
┃                  infrastructure/                             ┃
┃                                                              ┃
┃  ┌─────────────────────┐   ┌──────────────────────┐        ┃
┃  │   REPOSITORIES      │   │   STORAGE            │        ┃
┃  │   repositories/     │   │   storage/           │        ┃
┃  │                     │   │                      │        ┃
┃  │  LocalStorage       │   │  LocalStorage        │        ┃
┃  │  TaskRepository     │   │  Adapter             │        ┃
┃  │                     │   │                      │        ┃
┃  │  LocalStorage       │   │  Abstrai acesso ao   │        ┃
┃  │  UserPreferences    │   │  localStorage do     │        ┃
┃  │  Repository         │   │  browser             │        ┃
┃  │                     │   │                      │        ┃
┃  │  LocalStorage       │   └──────────────────────┘        ┃
┃  │  FocusSession       │                                    ┃
┃  │  Repository         │                                    ┃
┃  └─────────────────────┘                                    ┃
┃                                                              ┃
┃  ┌──────────────────────────────────────────────┐          ┃
┃  │   DEPENDENCY INJECTION                       │          ┃
┃  │   di/container.ts                            │          ┃
┃  │                                              │          ┃
┃  │  Gerencia criação e injeção de:             │          ┃
┃  │  • Storage Adapter                          │          ┃
┃  │  • Repositories                             │          ┃
┃  │  • Use Cases                                │          ┃
┃  │                                              │          ┃
┃  │  Único lugar que conhece implementações     │          ┃
┃  └──────────────────────────────────────────────┘          ┃
┃                                                              ┃
┃  - Implementações concretas                                 ┃
┃  - Detalhes técnicos (localStorage, APIs, etc)              ┃
┃  - Facilmente substituível                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## 🔄 Fluxo de Dados Detalhado

### Exemplo: Criar uma Task

```
1. Usuário clica em "Criar Task" no componente React
   │
   ▼
2. Componente chama hook: useTasks().createTask(...)
   │
   ▼
3. Hook chama Use Case através do Container:
   container.createTaskUseCase.execute(...)
   │
   ▼
4. CreateTaskUseCase:
   - Valida dados (título não vazio, etc)
   - Cria entidade Task com regras de negócio
   - Chama taskRepository.save(task)
   │
   ▼
5. LocalStorageTaskRepository:
   - Converte Task (entity) para DTO
   - Salva no localStorage via LocalStorageAdapter
   - Retorna Task salva
   │
   ▼
6. Use Case retorna Task para Hook
   │
   ▼
7. Hook atualiza estado React (setTasks)
   │
   ▼
8. Componente renderiza novamente com nova task
```

## 🎯 Regra de Dependência (Dependency Rule)

```
                     📊 Direção das Dependências
                              
                              INWARD
                                 ↑
                                 │
                                 │
    UI ────────────────────────────────────┐
    Presentation ──────────────────────────│
    Application ───────────────────────────│───→  DOMAIN
    Infrastructure ────────────────────────┘
                                 │
                                 │
                              OUTWARD
                              
    
    Camadas externas podem depender de camadas internas.
    Camadas internas NUNCA dependem de camadas externas.
```

## 🔀 Substituição de Implementações

### Exemplo: Trocar LocalStorage por API REST

```
┌─────────────────────────────────────────┐
│ ANTES (LocalStorage)                    │
├─────────────────────────────────────────┤
│                                         │
│  Use Case                               │
│      ↓                                  │
│  ITaskRepository (interface)            │
│      ↑                                  │
│  LocalStorageTaskRepository             │
│      ↓                                  │
│  localStorage                           │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ DEPOIS (API REST)                       │
├─────────────────────────────────────────┤
│                                         │
│  Use Case (SEM MUDANÇAS!)               │
│      ↓                                  │
│  ITaskRepository (interface)            │
│      ↑                                  │
│  ApiTaskRepository (NOVA)               │
│      ↓                                  │
│  fetch('/api/tasks')                    │
│                                         │
└─────────────────────────────────────────┘
```

**Código necessário:**

```typescript
// 1. Criar novo repository
class ApiTaskRepository implements ITaskRepository {
  async findAll() {
    const response = await fetch('/api/tasks');
    return response.json();
  }
  // ... outros métodos
}

// 2. Atualizar apenas o Container
class DIContainer {
  private taskRepository = new ApiTaskRepository(); // ← Só mudar aqui
  // Use Cases permanecem IGUAIS!
}
```

## 🧪 Testabilidade

### Testar sem UI e sem Banco de Dados

```
┌──────────────────────────────────────────────────────────┐
│  TESTE DO USE CASE                                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Test Suite                                              │
│      ↓                                                   │
│  Mock Repository (fake)                                  │
│      ↓                                                   │
│  CreateTaskUseCase (real)                                │
│      ↓                                                   │
│  Task Entity (real)                                      │
│                                                          │
│  ✅ Testa lógica de negócio isoladamente                │
│  ✅ Não precisa de React                                │
│  ✅ Não precisa de localStorage                         │
│  ✅ Teste rápido e confiável                            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 📦 Isolamento de Camadas

```
╔══════════════════════════════════════════════════════════╗
║                    DOMAIN LAYER                          ║
║  ┌────────────────────────────────────────────────┐     ║
║  │  Não conhece:                                  │     ║
║  │  ❌ React                                      │     ║
║  │  ❌ localStorage                               │     ║
║  │  ❌ Hooks                                      │     ║
║  │  ❌ APIs                                       │     ║
║  │  ❌ Qualquer framework ou biblioteca externa   │     ║
║  │                                                │     ║
║  │  Conhece apenas:                               │     ║
║  │  ✅ TypeScript básico                          │     ║
║  │  ✅ Suas próprias entidades                    │     ║
║  │  ✅ Suas próprias interfaces                   │     ║
║  └────────────────────────────────────────────────┘     ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║                  APPLICATION LAYER                       ║
║  ┌────────────────────────────────────────────────┐     ║
║  │  Não conhece:                                  │     ║
║  │  ❌ React                                      │     ║
║  │  ❌ localStorage (implementação)               │     ║
║  │  ❌ Componentes UI                             │     ║
║  │                                                │     ║
║  │  Conhece:                                      │     ║
║  │  ✅ Entidades do domínio                       │     ║
║  │  ✅ Interfaces de repositórios                 │     ║
║  │  ✅ Regras de negócio                          │     ║
║  └────────────────────────────────────────────────┘     ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║                INFRASTRUCTURE LAYER                      ║
║  ┌────────────────────────────────────────────────┐     ║
║  │  Não conhece:                                  │     ║
║  │  ❌ React                                      │     ║
║  │  ❌ Componentes UI                             │     ║
║  │                                                │     ║
║  │  Conhece:                                      │     ║
║  │  ✅ Interfaces do domínio                      │     ║
║  │  ✅ localStorage, APIs, etc                    │     ║
║  │  ✅ Detalhes técnicos                          │     ║
║  └────────────────────────────────────────────────┘     ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║                 PRESENTATION LAYER                       ║
║  ┌────────────────────────────────────────────────┐     ║
║  │  Conhece:                                      │     ║
║  │  ✅ React (useState, useEffect, etc)           │     ║
║  │  ✅ Use Cases (através do Container)           │     ║
║  │  ✅ Entidades (para tipagem)                   │     ║
║  └────────────────────────────────────────────────┘     ║
╚══════════════════════════════════════════════════════════╝
```

## 🎨 Diagrama de Componentes

```
┌──────────────────────────────────────────────────────────────┐
│                    TaskBoard (Component)                     │
│                                                              │
│  const { tasks, createTask, moveTask } = useTasks()         │
│                                      ▲                       │
└──────────────────────────────────────┼───────────────────────┘
                                       │
                              ┌────────┴────────┐
                              │                 │
┌─────────────────────────────┴──┐    ┌─────────┴──────────────┐
│  useTasks Hook                 │    │  useUserPreferences    │
│                                │    │  Hook                  │
│  - Estado: tasks, loading      │    │                        │
│  - Funções: createTask, etc    │    │  - Estado: preferences │
│                                │    │  - Funções: applyPreset│
└─────────────────────────────┬──┘    └─────────┬──────────────┘
                              │                 │
                              └────────┬────────┘
                                       │
                              ┌────────▼────────┐
                              │  DI Container   │
                              │                 │
                              │  • Use Cases    │
                              │  • Repositories │
                              │  • Storage      │
                              └─────────────────┘
```

---

**Este diagrama demonstra:**
- ✅ Separação clara de camadas
- ✅ Fluxo de dependências unidirecional
- ✅ Isolamento do domínio
- ✅ Facilidade de testar e substituir implementações
- ✅ Inversão de dependência em ação
