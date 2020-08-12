import React, {Component} from 'react';
import firebase from './firebase';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      dreams: [],
      userInput: '',
      inputTitle: '',
      errorMessage: ''
    }
  }

  componentDidMount() {
    const dbRef = firebase.database().ref();

    dbRef.on('value', (snapshot) => {

      const data = snapshot.val();
      console.log(data);

      const newDreamsArray = [];

      for (let key in data) {
        newDreamsArray.push({
          key: key,
          data: data[key]
        });
      }

      this.setState({
        dreams: newDreamsArray
      })
    })
  }

  handleChange = (event) => {
    this.setState({
      userInput: event.target.value
    })
  }

  handleTitle = (event) => {
    this.setState({
      inputTitle: event.target.value
    })
  }

  handleClick= (event) => {
    event.preventDefault();

    const dbRef = firebase.database().ref();

    if (this.state.userInput !== "" && this.state.inputTitle !== "") {
      // push dream object to firebase
      const dreamObjectTwo = {
        dream: this.state.userInput,
        title: this.state.inputTitle,
      }
      dbRef.push(dreamObjectTwo);

      // reset error handling
      this.setState({
        errorMessage: '',
      })
    } else {
      // error handling
      this.setState({
        errorMessage: "Please enter a message before submitting"
      })
    }

    // clear input text
    this.setState({
      inputTitle: '',
      userInput: ''
    })
  }

  handleRemove = (dreamId) => {
    const dbRef = firebase.database().ref();
    console.log(dbRef);

    dbRef.child(dreamId).remove();
  }
  
  


  render() {
    return (
      <div className="App">
        <h1>Dreams</h1>

        <form action="submit">
          <label htmlFor="newTitle">give your dream a title</label>
          <input onChange={this.handleTitle} value={this.state.inputTitle}type="text" id="newTitle"/>
          <label htmlFor="newDream">tell us about a dream youve had</label>
          <textarea 
              name="newDream" 
              id="newDream" 
              className="dreamInput" 
              rows="10" 
              onChange={this.handleChange}
              value={this.state.userInput} 
          ></textarea>
          <button onClick={this.handleClick}>Add Dream</button>
        </form>

        <p className="errorMessage">{this.state.errorMessage}</p>

        <ul>
          {
            this.state.dreams.map( (dreamObject) => {
              return (
              <li key={dreamObject.key} className="returnDream">
                <h2>{dreamObject.data.title}</h2>
                <p>{dreamObject.data.dream}</p>
                <button onClick={() => this.handleRemove(dreamObject.key)}>remove</button>
              </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}

export default App;
