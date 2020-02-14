import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import Footer from './Footer'
import {destroyTodo, loadTodos, saveTodo, updateTodo} from '../lib/service';
import {filterTodos} from '../lib/utils';

export default class TodoApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTodo: '',
            todos: []
        }
    }

    componentDidMount() {
        loadTodos()
            .then(({data}) => this.setState({todos: data}))
            .catch(() => this.setState({error: true}));
    }

    render() {
        const remaining = this.state.todos.filter(it => !it.isComplete);
        return (
            <Router>
                <div>
                    <header className="header">
                        <h1>todos</h1>
                        {this.state.error ? <span className={'error'}>Oh no!</span> : null}
                        <TodoForm
                            currentTodo={this.state.currentTodo}
                            onChange={e => this.setState({currentTodo: e.target.value})}
                            onSubmit={e => {
                                e.preventDefault();
                                const newTodo = {name: this.state.currentTodo, isComplete: false};
                                saveTodo(newTodo)
                                    .then(({data}) => this.setState({
                                        todos: this.state.todos.concat(data),
                                        currentTodo: '',
                                    }))
                                    .catch(() => this.setState({error: true}));
                            }}
                        />
                    </header>
                    <section className="main">
                        <Route
                            path={'/:filter?'}
                            render={({match}) =>
                                <TodoList
                                    todos={filterTodos(match.params.filter, this.state.todos)}
                                    onDelete={id => {
                                        destroyTodo(id)
                                            .then(() => this.setState({todos: this.state.todos.filter(it => it.id !== id)}))
                                    }}
                                    onToggle={id => {
                                        const targetTodo = this.state.todos.find(it => it.id === id);
                                        const updated = {...targetTodo, isComplete: !targetTodo.isComplete};
                                        updateTodo(updated)
                                            .then(({data}) => {
                                                const todos = this.state.todos.map(it => it.id === data.id ? data : it);
                                                this.setState({todos});
                                            })
                                    }}
                                />
                            }
                        />
                    </section>
                    <Footer remaining={remaining.length}/>
                </div>
            </Router>
        )
    }
}
