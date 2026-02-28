# MindEase - Clean Architecture

## 📋 Sobre o Projeto

MindEase é uma aplicação de produtividade e bem-estar mental, desenvolvida com **React + TypeScript** e arquitetada seguindo os princípios da **Clean Architecture**.

## 🏗️ Clean Architecture Implementada

Este projeto foi reestruturado para seguir rigorosamente os princípios da Clean Architecture, garantindo:

- ✅ **Independência de Frameworks**: A lógica de negócio não depende de React, LocalStorage ou qualquer biblioteca externa
- ✅ **Testabilidade**: Cada camada pode ser testada isoladamente
- ✅ **Independência de UI**: Os casos de uso não conhecem detalhes da interface
- ✅ **Independência de Banco de Dados**: Fácil trocar LocalStorage por API REST, IndexedDB, etc.
- ✅ **Separação de Responsabilidades**: Cada camada tem sua responsabilidade bem definida

### 📐 Estrutura de Camadas

```
src/
├── domain/                          # 🎯 CAMADA DE DOMÍNIO
│   ├── entities/                    # Entidades com regras de negócio
│   │   ├── Task.ts                  # Entidade Task
│   │   ├── UserPreferences.ts       # Entidade UserPreferences
│   │   └── FocusSession.ts          # Entidade FocusSession
│   └── repositories/                # Interfaces dos repositórios
│       ├── ITaskRepository.ts
│       ├── IUserPreferencesRepository.ts
│       └── IFocusSessionRepository.ts
│
├── application/                     # 🎪 CAMADA DE APLICAÇÃO
│   └── usecases/                    # Casos de uso (regras de negócio)
│       ├── CreateTaskUseCase.ts
│       ├── UpdateTaskUseCase.ts
│       ├── MoveTaskUseCase.ts
│       ├── ToggleChecklistItemUseCase.ts
│       ├── DeleteTaskUseCase.ts
│       ├── ListTasksUseCase.ts
│       ├── ManageUserPreferencesUseCase.ts
│       └── ManageFocusSessionUseCase.ts
│
├── infrastructure/                  # 🔌 CAMADA DE INFRAESTRUTURA
│   ├── storage/                     # Adaptadores de storage
│   │   └── LocalStorageAdapter.ts
│   ├── repositories/                # Implementações concretas
│   │   ├── LocalStorageTaskRepository.ts
│   │   ├── LocalStorageUserPreferencesRepository.ts
│   │   └── LocalStorageFocusSessionRepository.ts
│   └── di/                          # Injeção de Dependências
│       └── container.ts             # Container DI
│
├── presentation/                    # 🎨 CAMADA DE APRESENTAÇÃO
│   └── hooks/                       # Hooks React (interface com UI)
│       ├── useTasks.ts
│       ├── useUserPreferences.ts
│       └── useFocusSession.ts
│
└── app/                             # 🖼️ UI (componentes React)
    ├── components/                  # Componentes reutilizáveis
    └── context/                     # Context API (legado)
```

---

## 🎯 Camada de Domínio (Domain)

### Responsabilidade
Contém as **entidades** e **interfaces** do negócio. É o coração da aplicação.

### Características
- ✅ **Independente de tudo**: Não importa frameworks, UI ou infraestrutura
- ✅ **Regras de negócio puras**: Apenas lógica de domínio
- ✅ **Altamente testável**: Não precisa de mocks complexos

### Entidades Principais

#### 1. **Task** (`domain/entities/Task.ts`)
Representa uma tarefa com checklist.

```typescript
class Task {
  updateStatus(newStatus: TaskStatus): Task
  toggleChecklistItem(itemId: string): Task
  getProgress(): number
  isComplete(): boolean
  update(title, description, checklist): Task
}
```

**Regras de negócio encapsuladas:**
- Calcular progresso baseado no checklist
- Validar mudanças de status
- Manter histórico de datas (createdAt, updatedAt)

#### 2. **UserPreferences** (`domain/entities/UserPreferences.ts`)
Gerencia preferências e necessidades cognitivas do usuário.

```typescript
class UserPreferences {
  applyPreset(preset: 'tdah' | 'tea' | 'anxiety' | 'dyslexia'): UserPreferences
  updateNeed(need, value): UserPreferences
  toggleTheme(): UserPreferences
}
```

**Regras de negócio encapsuladas:**
- Validar níveis (complexity, contrast, spacing, fontSize)
- Aplicar presets específicos para necessidades cognitivas
- Garantir consistência dos dados

#### 3. **FocusSession** (`domain/entities/FocusSession.ts`)
Representa uma sessão de foco/timer (Pomodoro).

```typescript
class FocusSession {
  start(): FocusSession
  pause(): FocusSession
  resume(): FocusSession
  tick(): FocusSession
  reset(): FocusSession
  getProgress(): number
  getFormattedTime(): {minutes, seconds}
}
```

**Regras de negócio encapsuladas:**
- Controlar estados da sessão (idle, running, paused, complete)
- Calcular tempo restante
- Validar transições de estado

### Interfaces de Repositórios

#### **ITaskRepository** (`domain/repositories/ITaskRepository.ts`)
```typescript
interface ITaskRepository {
  findAll(): Promise<Task[]>
  findById(id: string): Promise<Task | null>
  save(task: Task): Promise<Task>
  update(task: Task): Promise<Task>
  delete(id: string): Promise<void>
  findByStatus(status): Promise<Task[]>
}
```

#### **IUserPreferencesRepository** (`domain/repositories/IUserPreferencesRepository.ts`)
```typescript
interface IUserPreferencesRepository {
  get(): Promise<UserPreferences>
  save(preferences): Promise<void>
  reset(): Promise<UserPreferences>
}
```

#### **IFocusSessionRepository** (`domain/repositories/IFocusSessionRepository.ts`)
```typescript
interface IFocusSessionRepository {
  getCurrentSession(): Promise<FocusSession | null>
  save(session): Promise<void>
  clear(): Promise<void>
  getCompletedCount(): Promise<number>
  incrementCompletedCount(): Promise<number>
}
```

---

## 🎪 Camada de Aplicação (Application)

### Responsabilidade
Contém os **casos de uso** (use cases) que orquestram as regras de negócio.

### Características
- ✅ **Independente de UI**: Não sabe se é React, Vue ou CLI
- ✅ **Orquestra entidades**: Coordena múltiplas entidades e repositórios
- ✅ **Validações de negócio**: Valida dados antes de chamar o domínio

### Casos de Uso Implementados

#### **Tasks**
- `CreateTaskUseCase` - Criar nova tarefa com validações
- `UpdateTaskUseCase` - Atualizar tarefa existente
- `MoveTaskUseCase` - Mover tarefa entre colunas (todo/in-progress/done)
- `ToggleChecklistItemUseCase` - Marcar/desmarcar item do checklist
- `DeleteTaskUseCase` - Deletar tarefa
- `ListTasksUseCase` - Listar todas as tarefas ou filtrar por status

#### **Preferências**
- `ManageUserPreferencesUseCase` - Gerenciar todas as operações de preferências

#### **Sessão de Foco**
- `ManageFocusSessionUseCase` - Gerenciar timer/sessões de foco

### Exemplo de Use Case

```typescript
// application/usecases/CreateTaskUseCase.ts
export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(dto: CreateTaskDTO): Promise<Task> {
    // Validações de negócio
    if (!dto.title || dto.title.trim().length === 0) {
      throw new Error('Task title is required');
    }

    // Criar entidade
    const task = new Task(/*...*/);

    // Persistir através da interface (não conhece implementação)
    return await this.taskRepository.save(task);
  }
}
```

**Vantagens:**
- Pode ser testado sem UI
- Pode ser testado sem banco de dados real (usando mocks)
- Pode ser reutilizado em diferentes interfaces (web, mobile, CLI)

---

## 🔌 Camada de Infraestrutura (Infrastructure)

### Responsabilidade
Implementa as **interfaces** definidas no domínio usando tecnologias concretas.

### Características
- ✅ **Adaptadores**: Adapta tecnologias externas para as interfaces do domínio
- ✅ **Substituível**: Fácil trocar implementações
- ✅ **Detalhes técnicos**: Conhece localStorage, APIs, etc.

### Adaptadores Implementados

#### **LocalStorageAdapter** (`infrastructure/storage/LocalStorageAdapter.ts`)
Abstrai o acesso ao `localStorage` do browser.

```typescript
interface IStorage {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
}
```

**Por que isso é importante?**
- Pode ser facilmente substituído por `SessionStorage`, `IndexedDB`, ou `API REST`
- Permite testar sem depender do browser
- Centraliza tratamento de erros

#### **Repositórios Concretos**

1. **LocalStorageTaskRepository** (`infrastructure/repositories/LocalStorageTaskRepository.ts`)
   - Implementa `ITaskRepository`
   - Persiste tasks no localStorage
   - Converte entre Entity e DTO

2. **LocalStorageUserPreferencesRepository** (`infrastructure/repositories/LocalStorageUserPreferencesRepository.ts`)
   - Implementa `IUserPreferencesRepository`
   - Persiste preferências no localStorage

3. **LocalStorageFocusSessionRepository** (`infrastructure/repositories/LocalStorageFocusSessionRepository.ts`)
   - Implementa `IFocusSessionRepository`
   - Persiste sessões e histórico no localStorage

### Container de Injeção de Dependências

#### **DIContainer** (`infrastructure/di/container.ts`)

Centraliza a criação de todas as dependências.

```typescript
class DIContainer {
  // Storage
  private storageAdapter = new LocalStorageAdapter();

  // Repositories
  private taskRepository = new LocalStorageTaskRepository(this.storageAdapter);
  
  // Use Cases
  public createTaskUseCase = new CreateTaskUseCase(this.taskRepository);
  public updateTaskUseCase = new UpdateTaskUseCase(this.taskRepository);
  // ... todos os outros use cases
}

export const container = new DIContainer();
```

**Vantagens:**
- **Single Responsibility**: Cada classe tem uma única responsabilidade
- **Dependency Inversion**: Classes dependem de abstrações (interfaces)
- **Fácil substituição**: Trocar localStorage por API é simples
- **Testabilidade**: Fácil injetar mocks nos testes

**Exemplo de substituição por API:**
```typescript
// Criar novo adaptador
class ApiTaskRepository implements ITaskRepository {
  async findAll() {
    const response = await fetch('/api/tasks');
    return response.json();
  }
  // ...
}

// No container, apenas trocar:
private taskRepository = new ApiTaskRepository();
// Nenhum use case precisa mudar!
```

---

## 🎨 Camada de Apresentação (Presentation)

### Responsabilidade
Interface entre a **UI (React)** e os **Use Cases**.

### Características
- ✅ **Hooks customizados**: Encapsulam chamadas aos use cases
- ✅ **Estado da UI**: Gerencia loading, errors, data
- ✅ **Independente de componentes**: Pode ser usado em qualquer componente

### Hooks Implementados

#### **useTasks** (`presentation/hooks/useTasks.ts`)
```typescript
const {
  tasks,              // Lista de tasks
  loading,            // Estado de carregamento
  error,              // Erros
  createTask,         // Função para criar
  updateTask,         // Função para atualizar
  moveTask,           // Função para mover
  toggleChecklistItem,// Função para toggle item
  deleteTask,         // Função para deletar
  getTasksByStatus,   // Filtrar por status
  reload,             // Recarregar
} = useTasks();
```

#### **useUserPreferences** (`presentation/hooks/useUserPreferences.ts`)
```typescript
const {
  preferences,        // Preferências atuais
  loading,
  error,
  updatePreferences,  // Atualizar todas
  applyPreset,        // Aplicar preset (tdah, tea, etc)
  updateNeed,         // Atualizar necessidade específica
  toggleTheme,        // Alternar tema
  resetPreferences,   // Resetar para padrão
  reload,
} = useUserPreferences();
```

#### **useFocusSession** (`presentation/hooks/useFocusSession.ts`)
```typescript
const {
  session,            // Sessão atual
  completedCount,     // Contador de sessões completas
  loading,
  error,
  createSession,      // Criar nova sessão
  startSession,       // Iniciar
  pauseSession,       // Pausar
  resumeSession,      // Retomar
  resetSession,       // Resetar
  setIntention,       // Definir intenção
  clearSession,       // Limpar
  reload,
} = useFocusSession();
```

### Exemplo de Uso em Componente

```typescript
// Componente React usando os hooks
function TaskList() {
  const { tasks, createTask, moveTask, loading } = useTasks();

  const handleCreateTask = async () => {
    await createTask('Nova tarefa', 'Descrição', []);
  };

  const handleMoveTask = async (taskId: string) => {
    await moveTask(taskId, 'done');
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <button onClick={handleCreateTask}>Criar Task</button>
      {tasks.map(task => (
        <div key={task.id}>
          {task.title}
          <button onClick={() => handleMoveTask(task.id)}>
            Mover para Concluído
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                         UI Layer                             │
│  (React Components - app/components/)                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ usa
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Presentation Layer                         │
│  (Custom Hooks - presentation/hooks/)                        │
│  - useTasks()                                                │
│  - useUserPreferences()                                      │
│  - useFocusSession()                                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ chama através do DI Container
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  (Use Cases - application/usecases/)                         │
│  - CreateTaskUseCase                                         │
│  - MoveTaskUseCase                                           │
│  - ManageUserPreferencesUseCase                              │
│  - ManageFocusSessionUseCase                                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ usa interfaces (não implementações!)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                            │
│  (Entities & Interfaces - domain/)                           │
│  Entities:                   Interfaces:                     │
│  - Task                      - ITaskRepository               │
│  - UserPreferences           - IUserPreferencesRepository    │
│  - FocusSession              - IFocusSessionRepository       │
└────────────────▲────────────────────────────────────────────┘
                 │
                 │ implementado por
                 │
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                        │
│  (Concrete Implementations - infrastructure/)                │
│  Repositories:                                               │
│  - LocalStorageTaskRepository                                │
│  - LocalStorageUserPreferencesRepository                     │
│  - LocalStorageFocusSessionRepository                        │
│                                                              │
│  Storage:                                                    │
│  - LocalStorageAdapter                                       │
└─────────────────────────────────────────────────────────────┘
```

### Explicação do Fluxo

1. **Usuário interage com UI** (componente React)
2. **Componente usa Hook** (`useTasks`, `useUserPreferences`, etc.)
3. **Hook chama Use Case** através do `container`
4. **Use Case executa lógica de negócio** usando Entities
5. **Use Case persiste dados** através da interface do Repository
6. **Repository concreto** (LocalStorage) salva os dados
7. **Dados retornam** pela mesma cadeia até a UI

---

## ✅ Benefícios da Arquitetura Implementada

### 1. **Testabilidade**
```typescript
// Testar Use Case sem UI e sem banco de dados
describe('CreateTaskUseCase', () => {
  it('should create task', async () => {
    const mockRepo = {
      save: jest.fn().mockResolvedValue(task)
    };
    const useCase = new CreateTaskUseCase(mockRepo);
    
    const result = await useCase.execute({
      title: 'Test',
      description: 'Test',
      checklist: []
    });
    
    expect(result.title).toBe('Test');
  });
});
```

### 2. **Manutenibilidade**
- Cada camada pode ser modificada independentemente
- Mudanças em UI não afetam regras de negócio
- Mudanças em storage não afetam use cases

### 3. **Escalabilidade**
- Fácil adicionar novos use cases
- Fácil adicionar novos repositórios (API, IndexedDB, etc.)
- Fácil adicionar novas entidades

### 4. **Substituição de Tecnologias**

#### Trocar LocalStorage por API REST:
```typescript
// infrastructure/repositories/ApiTaskRepository.ts
class ApiTaskRepository implements ITaskRepository {
  async findAll(): Promise<Task[]> {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    return data.map(this.dtoToEntity);
  }
  // ... implementar outros métodos
}

// infrastructure/di/container.ts
class DIContainer {
  private taskRepository = new ApiTaskRepository(); // ← Só mudar aqui!
  // Use cases permanecem iguais!
}
```

#### Adicionar Cache:
```typescript
class CachedTaskRepository implements ITaskRepository {
  constructor(
    private realRepo: ITaskRepository,
    private cache: IStorage
  ) {}

  async findAll(): Promise<Task[]> {
    const cached = this.cache.get('tasks');
    if (cached) return cached;
    
    const tasks = await this.realRepo.findAll();
    this.cache.set('tasks', tasks);
    return tasks;
  }
}
```

### 5. **Reutilização**
- Use cases podem ser usados em:
  - Web App (React)
  - Mobile App (React Native)
  - CLI
  - Testes automatizados
  - Background jobs

---

## 🚀 Como Usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar em desenvolvimento
```bash
npm run dev
```

### 3. Executar testes
```bash
npm test
```

### 4. Build para produção
```bash
npm run build
```

---

## 📚 Exemplos de Uso

### Criar uma nova Task
```typescript
import { useTasks } from '@/presentation/hooks/useTasks';

function MyComponent() {
  const { createTask } = useTasks();

  const handleCreate = async () => {
    await createTask(
      'Estudar Clean Architecture',
      'Ler documentação e exemplos',
      [
        { id: '1', text: 'Ler sobre camadas', completed: false },
        { id: '2', text: 'Implementar exemplo', completed: false }
      ]
    );
  };

  return <button onClick={handleCreate}>Criar Task</button>;
}
```

### Aplicar Preset de Preferências
```typescript
import { useUserPreferences } from '@/presentation/hooks/useUserPreferences';

function SettingsComponent() {
  const { applyPreset } = useUserPreferences();

  const handleApplyTDAH = async () => {
    await applyPreset('tdah');
    // Automaticamente aplica:
    // - Modo foco ativado
    // - Complexidade reduzida
    // - Contraste alto
    // - Espaçamento aumentado
  };

  return <button onClick={handleApplyTDAH}>TDAH</button>;
}
```

### Iniciar Sessão de Foco
```typescript
import { useFocusSession } from '@/presentation/hooks/useFocusSession';

function TimerComponent() {
  const { session, createSession, startSession } = useFocusSession();

  const handleStart = async () => {
    if (!session) {
      await createSession('focus', 25); // 25 minutos
    }
    await startSession();
  };

  return (
    <div>
      {session && (
        <div>
          {session.getFormattedTime().minutes}:
          {session.getFormattedTime().seconds}
        </div>
      )}
      <button onClick={handleStart}>Iniciar</button>
    </div>
  );
}
```

---

## 🧪 Testes

A arquitetura facilita testes em todos os níveis:

### Testar Entidades (Domain)
```typescript
import { Task } from '@/domain/entities/Task';

describe('Task', () => {
  it('should calculate progress correctly', () => {
    const task = new Task(
      '1',
      'Test',
      'Desc',
      'todo',
      [
        { id: '1', text: 'Item 1', completed: true },
        { id: '2', text: 'Item 2', completed: false }
      ]
    );

    expect(task.getProgress()).toBe(50);
  });
});
```

### Testar Use Cases (Application)
```typescript
import { CreateTaskUseCase } from '@/application/usecases/CreateTaskUseCase';

describe('CreateTaskUseCase', () => {
  it('should validate title', async () => {
    const mockRepo = { save: jest.fn() };
    const useCase = new CreateTaskUseCase(mockRepo as any);

    await expect(
      useCase.execute({ title: '', description: '', checklist: [] })
    ).rejects.toThrow('Task title is required');
  });
});
```

### Testar Repositórios (Infrastructure)
```typescript
import { LocalStorageTaskRepository } from '@/infrastructure/repositories/LocalStorageTaskRepository';
import { LocalStorageAdapter } from '@/infrastructure/storage/LocalStorageAdapter';

describe('LocalStorageTaskRepository', () => {
  it('should save and retrieve task', async () => {
    const storage = new LocalStorageAdapter();
    const repo = new LocalStorageTaskRepository(storage);

    const task = new Task('1', 'Test', 'Desc', 'todo', []);
    await repo.save(task);

    const retrieved = await repo.findById('1');
    expect(retrieved?.title).toBe('Test');
  });
});
```

---

## 📖 Princípios SOLID Aplicados

### **S** - Single Responsibility Principle
- Cada classe tem uma única responsabilidade
- `CreateTaskUseCase` só cria tasks
- `LocalStorageAdapter` só lida com storage

### **O** - Open/Closed Principle
- Aberto para extensão, fechado para modificação
- Pode adicionar novos repositórios sem modificar existentes

### **L** - Liskov Substitution Principle
- Qualquer implementação de `ITaskRepository` pode substituir outra
- `LocalStorageTaskRepository` e `ApiTaskRepository` são intercambiáveis

### **I** - Interface Segregation Principle
- Interfaces específicas e focadas
- `IStorage` tem apenas 4 métodos essenciais

### **D** - Dependency Inversion Principle
- Use cases dependem de interfaces, não implementações
- DI Container injeta dependências concretas

---

## 🎓 Conceitos-Chave

### Entidades vs DTOs
- **Entidades**: Objetos com comportamento e regras de negócio
- **DTOs**: Objetos simples para transferência de dados

### Repositories vs Services
- **Repository**: Abstrai persistência de dados
- **Service**: (não usado aqui) Orquestraria múltiplos repositórios

### Use Cases vs Controllers
- **Use Case**: Regra de negócio específica
- **Controller**: (em APIs) Recebe request, chama use case, retorna response

---

## 📚 Referências

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Dependency Injection](https://martinfowler.com/articles/injection.html)

---
