/*global swal*/

import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

const apiToken = 'BQBnEIM4d-s-QNXf9HG5jc2zSj-bp3cOqiUfUC_HE3IzfOrmye5oEra8uTlEOL89RCX7ANaXhyWYgwt2egsUu0AzIdBNBOLtqHi2mIMsbfSCCeCI2d08pDStEbPrtwk_mCsWZ3Ovb4d3QwKPzuqxaifR9ShBVWepB1eP8zqewA';

function componentDidMount(){
  this.setState({ text: "Bonjour" });
}

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

class AlbumCover extends Component {
  render() {
    const src = this.props.track.album.images[0].url; // A changer ;)
    return (<img src={src} style={{ width: 400, height: 400 }} />);
  }
}

//this.track.album.images[0].url
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: "",
      musicData: "",
      songsLoaded: false,
      track: "",
      track2: "",
      track3: "",
      track_id:"",
      track_array: Array(3).fill(null),
      timeout: null

    };
  }
  componentDidMount(){
    fetch('https://api.spotify.com/v1/me/tracks?market=FR', {
    method: 'GET',
    headers: {
    Authorization: 'Bearer ' + apiToken,
    },
  })
    .then(response => response.json())
    .then((data) => {
      console.log("Réponse reçue ! Voilà ce que j'ai reçu : ", data);
      let indices = new Set();
      while (indices.size < 3){
        let index = getRandomNumber(data.items.length);
        indices.add(index);
      };
      indices = Array.from(indices);
      //let indices = shuffleArray([0,1,2]);
      this.setState({text: "Mon compte Spotify:",
              musicData: data.items,
              track: data.items[indices[0]].track,
              track2: data.items[indices[1]].track,
              track3: data.items[indices[2]].track,
              track_array: shuffleArray([data.items[indices[0]].track,data.items[indices[1]].track,data.items[indices[2]].track]),
              songsLoaded: true,
              track_id:data.items[0].track.id,
              timeout: setTimeout(() => this.newGame(), 1500)
    })
    

  })
    this.setState({ text: "Bonjour" });
  }
  newGame(){
    let indices = new Set();
    while (indices.size < 3){
      let index = getRandomNumber(this.state.musicData.length);
      indices.add(index);
    };
    indices = Array.from(indices);
    this.setState({
      track: this.state.musicData[indices[0]].track,
      track2: this.state.musicData[indices[1]].track,
      track3: this.state.musicData[indices[2]].track,
      track_array: shuffleArray([this.state.musicData[indices[0]].track,this.state.musicData[indices[1]].track,this.state.musicData[indices[2]].track]),
      timeout: setTimeout(() => this.newGame(), 1500)
    }
    )}
  checkAnswer(track_name) {
    if (track_name == this.state.track_id){
      clearTimeout(this.state.timeout);
      swal('Bravo', 'Sous-titre', 'success').then(() => this.newGame());
    } else {
      swal('No', 'Sous-titre', 'error');
    }
  }
  render() {
    //const has_preview= (this.state.track.preview_url==null);
    let song_play;

    if (this.state.track.preview_url){
      song_play= <Sound url={this.state.track.preview_url} playStatus={Sound.status.PLAYING}/>;
    } else {
      song_play= <div></div>;
    }
    if (this.state.songsLoaded){
      return(
        <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Bienvenue sur le Blindtest</h1>
        </header>
        <div className="App-images">
          <p>{this.state.text}</p>

          <p>Longueur du Tableau {this.state.musicData.length}</p>

          <p>Premiere Chanson {this.state.musicData[0].track.name}</p>

          <AlbumCover track={this.state.track}/>
          {song_play}
        </div>
        <div className="App-buttons">
          <button onClick={() => this.checkAnswer(this.state.track_array[0].id)}>{this.state.track_array[0].name}</button>
          <button onClick={() => this.checkAnswer(this.state.track_array[1].id)}>{this.state.track_array[1].name}</button>
          <button onClick={() => this.checkAnswer(this.state.track_array[2].id)}>{this.state.track_array[2].name}</button>
        </div>
      </div>
      );
    } else {
      return(<img src={loading} className="App-loading" alt="loading"/>);
    };
  }
}

export default App;
