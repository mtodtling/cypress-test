export const filterTodos = (filter, todos) => filter
    ? todos.filter(it => it.isComplete === (filter === 'completed'))
    : todos;