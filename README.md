# 🧠 MindEase - Aplicação de Produtividade com Clean Architecture

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-green)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

**MindEase** é uma aplicação de produtividade e bem-estar mental, desenvolvida com **React + TypeScript** e arquitetada seguindo rigorosamente os princípios da **Clean Architecture**.

## 🎯 Sobre o Projeto

Aplicação focada em ajudar usuários com necessidades cognitivas específicas (TDAH, TEA, Ansiedade, Dislexia) a gerenciar tarefas, manter foco e personalizar a interface.

### ✨ Funcionalidades

- 📋 **Gerenciamento de Tarefas** - Kanban com checklist
- ⏱️ **Timer de Foco** - Técnica Pomodoro
- 👤 **Perfil do Usuário** - Preferências e necessidades cognitivas
- 🎨 **Personalização** - Presets para diferentes necessidades
- 🌓 **Tema Claro/Escuro**

## 🏗️ Clean Architecture

Este projeto foi **completamente reestruturado** seguindo **Clean Architecture**:

```
✅ Camada de Domínio Isolada
✅ Casos de Uso Independentes de UI
✅ Adaptadores e Interfaces Claras
✅ Separação Total de Responsabilidades
```

### 📐 Estrutura de 4 Camadas

```
src/
├── domain/           🎯 Entidades + Interfaces (Núcleo)
├── application/      🎪 Use Cases (Regras de Negócio)
├── infrastructure/   🔌 Adaptadores (LocalStorage, etc)
└── presentation/     🎨 Hooks React (Interface com UI)
```

## 📚 Documentação Completa

### 🚀 Começar Rapidamente
- **[QUICK_START.md](QUICK_START.md)** - Guia rápido de 5 minutos
- **[INDEX.md](INDEX.md)** - Índice completo de toda documentação

### 📖 Entender a Arquitetura
- **[RESUMO_EXECUTIVO.md](RESUMO_EXECUTIVO.md)** - Visão geral executiva
- **[CLEAN_ARCHITECTURE.md](CLEAN_ARCHITECTURE.md)** - Documentação completa detalhada
- **[ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)** - Diagramas visuais

### 💻 Exemplos de Código
- **[examples/UsageExamples.tsx](src/examples/UsageExamples.tsx)** - Exemplos práticos

## 🚀 Início Rápido

### Instalação

```bash
npm install
```

### Executar em Desenvolvimento

```bash
npm run dev
```

### Build para Produção

```bash
npm run build
```

### Testes

```bash
npm test
```

## 💡 Como Usar

### Em Componentes React

```typescript
import { useTasks } from '@/presentation/hooks';

function MeuComponente() {
  const { tasks, createTask, moveTask, loading } = useTasks();

  const handleCreate = async () => {
    await createTask('Nova Tarefa', 'Descrição', []);
  };

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
      <button onClick={handleCreate}>Criar Tarefa</button>
    </div>
  );
}
```

**Mais exemplos:** [QUICK_START.md](QUICK_START.md)

## 🎯 Benefícios da Arquitetura

### 1. ✅ Testabilidade
```typescript
// Testar sem UI e sem banco de dados
const mockRepo = { save: jest.fn() };
const useCase = new CreateTaskUseCase(mockRepo);
await useCase.execute({ title: 'Test', ... });
```

### 2. ✅ Manutenibilidade
- Mudar UI não afeta regras de negócio
- Mudar storage não afeta use cases
- Cada camada evolui independentemente

### 3. ✅ Substituição Fácil
```typescript
// Trocar localStorage por API é simples:
// Só criar ApiTaskRepository e mudar no Container!
```

### 4. ✅ Reutilização
Os mesmos Use Cases funcionam em:
- ✅ Web (React)
- ✅ Mobile (React Native)
- ✅ CLI
- ✅ Testes

**Detalhes:** [CLEAN_ARCHITECTURE.md#benefícios](CLEAN_ARCHITECTURE.md#-benefícios-da-arquitetura-implementada)

## 📊 Implementação

### Domain Layer (Núcleo)
- **3 Entidades**: Task, UserPreferences, FocusSession
- **3 Interfaces** de Repositórios
- **Zero dependências** externas

### Application Layer (Use Cases)
- **8 Use Cases** implementados
- **Independente de UI** e frameworks
- **Lógica de negócio** isolada

### Infrastructure Layer (Adaptadores)
- **LocalStorage** abstraído
- **3 Repositórios** concretos
- **Container DI** para gerenciar dependências

### Presentation Layer (Hooks)
- **3 Hooks React** customizados
- **Interface limpa** para componentes
- **Gerencia estado** da UI

**Diagrama detalhado:** [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)

## 🔄 Fluxo de Dados

```
UI Component
    ↓ usa
Presentation Hook
    ↓ chama
Use Case (Application)
    ↓ usa
Entity + Interface (Domain)
    ↑ implementado por
Repository (Infrastructure)
    ↓ persiste
Storage (localStorage)
```

**Regra de Ouro:** Dependências sempre apontam para dentro (para o Domain).

## 🧪 Testes

```typescript
// Testar Entidade
describe('Task', () => {
  it('calcula progresso', () => {
    const task = new Task(...);
    expect(task.getProgress()).toBe(50);
  });
});

// Testar Use Case
describe('CreateTaskUseCase', () => {
  it('valida título', async () => {
    const useCase = new CreateTaskUseCase(mockRepo);
    await expect(useCase.execute({ title: '' }))
      .rejects.toThrow('Task title is required');
  });
});
```

## 🔮 Próximos Passos

- [ ] Migrar componentes existentes para usar os hooks
- [ ] Adicionar testes unitários completos
- [ ] Implementar API REST como alternativa ao localStorage
- [ ] Adicionar autenticação e multi-usuário
- [ ] Implementar sincronização offline-first

## 📖 Leia Mais

- 📘 **[Documentação Completa](CLEAN_ARCHITECTURE.md)** - Tudo sobre a arquitetura
- 📐 **[Diagramas](ARCHITECTURE_DIAGRAM.md)** - Visualizar a arquitetura

## 🎓 Tecnologias

- **React** - Framework UI
- **TypeScript** - Linguagem
- **Vite** - Build tool
- **Vitest** - Testing framework
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis

## 📝 Princípios Aplicados

- ✅ **SOLID** - Todos os 5 princípios
- ✅ **Clean Architecture** - 4 camadas bem definidas
- ✅ **Dependency Inversion** - Use cases usam interfaces
- ✅ **Separation of Concerns** - Cada camada tem sua responsabilidade
- ✅ **Testability First** - Fácil de testar

## 🤝 Contribuindo

1. Entenda a arquitetura: [CLEAN_ARCHITECTURE.md](CLEAN_ARCHITECTURE.md)
2. Siga o padrão: [QUICK_START.md#adicionar-nova-funcionalidade](QUICK_START.md#-adicionar-nova-funcionalidade)
3. Mantenha os princípios: Cada camada isolada

## 📄 Licença

MIT License

## 👨‍💻 Desenvolvido com Clean Architecture

Este projeto demonstra uma implementação completa e prática de Clean Architecture em React + TypeScript, com foco em:
- Separação clara de responsabilidades
- Alta testabilidade
- Fácil manutenção
- Escalabilidade
- Substituição de implementações

---