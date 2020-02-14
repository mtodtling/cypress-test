import React from 'react'

export default props =>
    <ul className="todo-list">
        {props.todos.map(todo =>
            <TodoItem
                key={todo.id}
                {...todo}
                onDelete={props.onDelete}
                onToggle={props.onToggle}
            />)}
    </ul>

const TodoItem = props =>
    <li className={props.isComplete ? 'completed' : null}>
        <div className="view">
            <input
                className="toggle"
                type="checkbox"
                checked={props.isComplete}
                onChange={() => props.onToggle(props.id)}
            />
            <label>
                {props.name}
            </label>
            <button className="destroy" onClick={() => props.onDelete(props.id)}/>
        </div>
    </li>;