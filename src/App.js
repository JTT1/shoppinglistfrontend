import './App.css';
import {useState, useEffect} from 'react'

const URL = "http://localhost/harjoitus/"

function App() {
    const [items, setItems] = useState([]);
    const [item1, setItem1] = useState('');
    const [item2, setItem2] = useState('')

    useEffect(() => {
      fetch(URL + 'index.php')
      .then(response => response.json())
      .then(
        (response) => {
          setItems(response);
        }, (error) => {
          alert(error);
        }
      )
    }, [])

    function save(e) {
      e.preventDefault();
      let status = 0;
      fetch(URL + "add.php", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        }, 
        body: JSON.stringify({
          description: item1,
          amount: item2
        })
      })
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            setItems(items => [...items, res]);
            setItem1('');
            setItem2('');
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
    }

    function remove(id) {
      let status = 0;
      fetch(URL + 'delete.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
          body: JSON.stringify({
          id: id
        })
      }) 
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            const newListWithoutRemoved = items.filter((item) => item.id !== id);
            setItems(newListWithoutRemoved);
          } else {
            alert(res.error)
          }
        }, (error) => {
          alert(error);
        }
      )
    }

    return (
      <div className="sivusto">
        <h2>Shopping list</h2> 
        <div>
          <form onSubmit={save}>
            <label>New Item</label>
            <input value={item1} onChange={e => setItem1(e.target.value)} placeholder="type description" />
            <input value={item2} onChange={e => setItem2(e.target.value)} placeholder="type amount" />
            <button>Add</button>
          </form>
        </div>
        <div className="lista">
          {items.map(item => (
            <p key ={item.id}>{item.description} <span>{item.amount}</span><a className="delete" onClick={() => remove(item.id)} href="#">Delete</a></p>
          ))}
        </div>
      </div>
    )

}

export default App;
