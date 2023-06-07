import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { increment, decrement } from '../features/counter/counterSlice';

function Counter() {
  const count = useAppSelector(state => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <button className="btn btn-primary" onClick={() => dispatch(increment())}>Increment</button>
      <span>{count}</span>
      <button className="btn btn-primary" onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}

export default Counter;