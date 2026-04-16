import React, { useState } from 'react'

const Form = () => {

  const [addTask, setAddTask] = useState({
    title : "",
    discription : "",
  });

  const changeHandler = (e) => {
    const {name , value} = e.target;

    setAddTask({...addTask , [name] : value});
  }

  const submitHandler = async (e) => {
    e.preventDefault();
  }

  return (
    <form onSubmit={submitHandler} className="w-full max-w-lg">

      <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-5">New Task</h2>

      <div className="space-y-3">

        <input
          type="text"
          placeholder="Task title"
          name="title"
          value={addTask.title}
          onChange={changeHandler}
          className="w-full bg-transparent border-b border-zinc-800 hover:border-zinc-700 focus:border-violet-500 text-white placeholder-zinc-700 py-3 text-sm focus:outline-none transition-all duration-200"
        />

        <input
          type="text"
          placeholder="Description (optional)"
          name="discription"
          value={addTask.discription}
          onChange={changeHandler}
          className="w-full bg-transparent border-b border-zinc-800 hover:border-zinc-700 focus:border-violet-500 text-white placeholder-zinc-700 py-3 text-sm focus:outline-none transition-all duration-200"
        />

        <input
          type="submit"
          value="Add Task →"
          className="mt-2 bg-transparent hover:bg-violet-600 border border-zinc-700 hover:border-violet-600 text-zinc-400 hover:text-white font-medium rounded-lg px-5 py-2.5 text-sm cursor-pointer transition-all duration-200"
        />

      </div>
    </form>
  )
}

export default Form