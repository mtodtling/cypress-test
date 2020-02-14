import React from 'react'

export default props =>
    <form onSubmit={props.onSubmit}>
        <input
            value={props.currentTodo}
            type='text'
            autoFocus
            className="new-todo"
            onChange={props.onChange}
            placeholder="What needs to be done?"/>
    </form>