 import { useState } from 'react';
 
 function Todo(props){
    function clicked_e(){
        console.log('Hey ' + props.text + ' clicked!')
    }

    return (   
        <div className="card">
            <h2>{props.text}</h2>
            <div className="actions">
            <button className="btn" onClick={clicked_e}>Delete</button>
            </div>
        </div>
    )
 }

 export default Todo;