import React, { Component } from 'react';
import axios from 'axios'
import './JokesList.css'
import { async } from 'q';
import Joke from './Joke'
import uuid from 'uuid/v4'

class JokesList extends Component {
    static defaultProps = {
        numJokes: 10
    }
    constructor(props) {
        super(props);
        this.state = {
            jokes:JSON.parse(window.localStorage.getItem("jokes")||'[]'),
            isLoading:false
        }
        this.handleClick=this.handleClick.bind(this)
        // this.newJoke()=this.newJoke.bind(this)
    }
     componentDidMount() {
       if(this.state.jokes.length<=0) this.getJoke();
        
    }
     getJoke=async()=>{
        let jokes = [];
        while (jokes.length < this.props.numJokes) {
            let res = await axios.get('https://icanhazdadjoke.com/', {
                headers: { Accept: 'application/json' }
            })
            jokes.push({joke:res.data.joke,votes:0,id:uuid()})
        }
        this.setState(currSt=>({
            isLoading:false,
            jokes:[...currSt.jokes,...jokes]
        }),
        ()=>window.localStorage.setItem('jokes',JSON.stringify(this.state.jokes))
        )
       
    }
            // newJokes=async()=>{
            //     let jokes = [];
            //     while (jokes.length < this.props.numJokes) {
            //         let res = await axios.get('https://icanhazdadjoke.com/', {
            //             headers: { Accept: 'application/json' }
            //         })
            //         jokes.push({joke:res.data.joke,vote:0,id:uuid()})
            //     }
            //     this.setState(currSt=>({
            //         jokes:[...currSt.jokes]
            //     }))
            // }
            handleVote(id,delta){
                this.setState(
                    st=>({
                        jokes:st.jokes.map(j=>
                            j.id===id?{...j,votes:j.votes+delta}:j)
                    }),
                    ()=>window.localStorage.setItem('jokes',JSON.stringify(this.state.jokes))
                )
            }
            handleClick=()=>{
                this.setState({isLoading:true},
                    this.getJoke
                    )
            }
    render() {
        if(this.state.isLoading||this.state.jokes.length<=0){
            return(
                <div className='JokeList-spinner'>
                <i className='far fa-8x fa-laugh fa-spin' ></i>
                <h1 className="JokesList-title">Loading...</h1>
                </div>
            )
        }
        let sortedJokes=this.state.jokes.sort((a,b)=>b.votes-a.votes)
        return (
            <div className="JokesList">
                <div className="JokesList-sidebar">
                    <h1 className="JokesList-title"><span>Dad</span> Jokes</h1>
                    <img className='JokesList-emoji' 
                    src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"></img>
                    <button className='JokesList-Button button'
                    onClick={this.handleClick}>New Jokes</button>
                </div>
                <div className='JokesList-jokes'>
                {sortedJokes.map((el,i)=>(
                    <Joke key={el.id}
                    upVote={()=>this.handleVote(el.id,1)}
                    downVote={()=>this.handleVote(el.id,-1)}
                    votes={el.votes} joke={el.joke}/>
                ))}
                </div>
            </div>
        );
    }
}

export default JokesList;