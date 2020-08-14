import React, {Component} from 'react';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      dreams: [],
      userInput: '',
      inputTitle: '',
      errorMessage: '',
    }
  }

  // pull data from firebase to display
  componentDidMount() {
    const dbRef = firebase.database().ref();

    dbRef.on('value', (snapshot) => {

      const data = snapshot.val();

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

  // dream content event listener
  handleChange = (event) => {
    this.setState({
      userInput: event.target.value
    })
  }

  // title event listener
  handleTitle = (event) => {
    this.setState({
      inputTitle: event.target.value
    })
  }

  // push dream input data to firebase
  handleClick= (event) => {
    event.preventDefault();

    const dbRef = firebase.database().ref();

    if (this.state.userInput !== "" && this.state.inputTitle !== "") {
      // push dream object to firebase
      const dreamObjectTwo = {
        dream: this.state.userInput,
        title: this.state.inputTitle,
        vote: 0
      }
      dbRef.push(dreamObjectTwo);

      // reset error handling
      this.setState({
        errorMessage: '',
      })
    } else {
      // error handling
      this.setState({
        errorMessage: "Please give your entry a title and content before submitting"
      })
    }

    // clear input text
    this.setState({
      inputTitle: '',
      userInput: ''
    })
    window.location = "#addedDream";
  }

  // upvote selected entry
  handleVote = (voteId) => {
    const dbRef = firebase.database().ref(`/${voteId}`);

    dbRef.once('value', (snapshot) => {
      const newValue = snapshot.val();
      newValue.vote++;

      dbRef.set(newValue);
    }) 
  }

  // remove entry
  handleRemove = (dreamId) => {
    const dbRef = firebase.database().ref();

    dbRef.child(dreamId).remove();
  }
  
  


  render() {
    return (
      <main className="App">
        <section className="top">
          <div className="wrapper">
            <h1>Dream Share</h1>
            <h3>A place for everyone to document their dreams and explore the bizarre world of the subconcious</h3>
            <form action="submit">
              <label htmlFor="newTitle">give your dream a title</label>
              <input onChange={this.handleTitle} value={this.state.inputTitle}type="text" id="newTitle" className="titleInput" placeholder="Title" maxlength="20"/>
              <label htmlFor="newDream">tell us about a dream you've had</label>
              <textarea 
                  name="newDream" 
                  id="newDream" 
                  className="dreamInput" 
                  rows="20" 
                  onChange={this.handleChange}
                  value={this.state.userInput} 
                  maxlength="1100"
                  placeholder="One night I dreamt..."
              ></textarea>
              <button className="addDream" onClick={this.handleClick}>Share Dream</button>
            </form>

            <p className="errorMessage">{this.state.errorMessage}</p>
          </div>
        </section>
        <section className="displaySection">
          <ul className="dreamDisplay wrapper">
            {
              this.state.dreams.map( (dreamObject) => {
                return (
                <li key={dreamObject.key} className="returnDream">
                  <h2>{dreamObject.data.title}</h2>
                  <p>{dreamObject.data.dream}</p>
                  <div className="upVote">
                    <p>{dreamObject.data.vote}</p>
                    <button className="voteButton" onClick={() => this.handleVote(dreamObject.key)}><FontAwesomeIcon icon={faHeart}/></button>
                  </div>
                  <button className="removeButton" onClick={() => this.handleRemove(dreamObject.key)}><FontAwesomeIcon icon={faTimes}/></button>
                </li>
                )
              })
            }
          </ul>
        </section>
        <footer id='addedDream'>
          <p>Created by Arman Aliani</p>
        </footer>
      </main>
    );
  }
}

export default App;
