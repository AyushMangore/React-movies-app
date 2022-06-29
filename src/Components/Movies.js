// Author : Ayush Mangore
// In this movies application, I have used TMDB : the movie data base website api which provides information about
// the movies , I have made API request and collected data and displayed it in a useful manner, informations like
// rating, popularity and genres are shown, user also have facility to store their favorites movies.

// Imported reqired libraries like react ans componet
// In this project I have used class components
// I have used axios to make API request
import React, {Component} from 'react';
import axios from 'axios';

// As we are using class component, Class name is provided which will extend Component class present in our react 
export default class Movies extends Component {
    // Now in constructor we will define states
    constructor(){
        // super is used so that parent constructor will be called
        super();
        //  now we will define states
        this.state = {
            // hover state will store the staus of mouse hovering over movie cards
            hover:'',
            // parr will store the pagination status
            parr:[1],
            // currpage will help to identify user is in which page currently
            currPage:1,
            // movies array will store all the information about movies that we will fetch through api request
            movies:[],
            //  we are providing user an option to add or remove movie from favorites, there favourites array is used to capture the status of added favourites
            favourites:[]
        }
    }
    // The componentDidMount() method allows us to execute the React code when the component is already placed in the DOM (Document Object Model). 
    // This method is called during the Mounting phase of the React Life-cycle i.e after the component is rendered.
    // componentDidMount() is invoked immediately after a component is mounted (inserted into the tree)
    async componentDidMount(){
        // side effects work 
        // making request with the help of axios, and we are passing the page number as well : this is according to the api usage rules in TMDB website
        // as this is an asyncronous task we will use async await here
        // once request is served, we will collect data in our movies array, we will generate deep copy through spread operator
        const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=03c912b30b47534c593a77ec90a9664c&language=en-US&page=${this.state.currPage}`);
        let data = res.data;
        this.setState({
            movies:[...data.results]
        })
    }
    // this function will work in accordance to pagination status , whenever user toggle pages movies will chane
    // everything is same as above function
    changeMovies = async() => {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=03c912b30b47534c593a77ec90a9664c&language=en-US&page=${this.state.currPage}`);
        let data = res.data;
        this.setState({
            movies:[...data.results]
        })
    }
    // In pagination we have two button right and left
    // When user will click on right button we have to load a new page
    // first we will make a temp array and store the number of pages and add one more page denoting new page
    // then update the parr array which is monitoring the staus of pagination, and we also modify the curr page status
    // after this we will call changemovies function so that changes will be displayed in ui as well
    handleRight = () => {
        let temparr = [];
        for(let i=1;i<=this.state.parr.length+1;i++){
            temparr.push(i);
        }
        this.setState({
            parr:[...temparr],
            currPage:this.state.currPage+1
        },this.changeMovies)
    }
    // In pagination we have two button right and left
    // When user will click on left button we have to move one page back, no need to toggle total pages
    //  we will just decrement the curr page , and call our changemovies function so that changes will be displayed in ui as well
    handleLeft = () => {
        if(this.state.currPage !== 1){
            this.setState({
                currPage:this.state.currPage-1
            },this.changeMovies)
        }
    }
    // Instead of clicking on just right and lefg button user can click on any page number present there
    // So, we will update the value the curr page and call our changemovies function so that changes will be displayed in ui as well 
    handleClick = (value) => {
        if(value != this.state.currPage){
            this.setState({
                currPage:value
            },this.changeMovies)
        }
    }
    // This function will handle add to/ remove from favourites functionality
    // we have used browser local storage to store the information
    // First we will fetch the old information of our movies, if present then we will get the information or else empty array
    // if movie is already there in favourites then we will remove, or else if the movie is not there then we will simple add the movie
    // and then we will update out localstorage database , after updating database to updtae favorite state we will call another function
    handleFavourites = (movie) => {
        let oldData = JSON.parse(localStorage.getItem('movies-app') || "[]");
        if(this.state.favourites.includes(movie.id)){
            oldData = oldData.filter((m) => {
                return m.id != movie.id;
            })
        }else{
            oldData.push(movie);
        }
        localStorage.setItem('movies-app',JSON.stringify(oldData));
        this.handleFavouritesState();
    }
    //  this function is simply fetching the information of all stored movies in local storage and updating our favourites array
    handleFavouritesState=()=>{
        let oldData = JSON.parse(localStorage.getItem('movies-app') || '[]')
        let temp = oldData.map((movie) => movie.id);
        this.setState({
            favourites:[...temp]
        })
    }
// React renders HTML to the web page by using a function called render().
// The purpose of the function is to display the specified HTML code inside the specified HTML element.
// In the render() method, we can read props and state and return our JSX code to the root component of our app.
// In the render() method, we cannot change the state, and we cannot cause side effects( such as making an HTTP request to the webserver).
    render() {
        // let movie = movies.results
        return (
            <>
                {
                    // If we have zero movies then simply show loading status
                    this.state.movies.length===0?
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div> : 
                    //  else populate page with the movies
                    <div>
                        <h3 className="text-center"><strong>Trending</strong></h3>
                        <div className="movies-list">
                            {
                                //  Now iterating through all the movies one by one we will display them
                                this.state.movies.map((movieObj)=>(
                                    <div className="card movies-card" onMouseEnter={()=>this.setState({hover:movieObj.id})} onMouseLeave={()=>this.setState({hover:''})}>
                                        <img src={`https://image.tmdb.org/t/p/original${movieObj.backdrop_path}`}  alt={movieObj.title} className="card-img-top movies-img"/>
                                        {/* <div className="card-body"> */}
                                            <h5 className="card-title movies-title">{movieObj.original_title}</h5>
                                            {/* <p class="card-text movies-text">{movieObj.overview}</p> */}
                                            <div className="button-wrapper" style={{display:'flex',width:'100%',justifyContent:'center'}}>
                                            {
                                                this.state.hover == movieObj.id &&
                                                // If movie is already there in favorites then user will see the option to delete it
                                                // or else if movie is not present then user will see the option to add it
                                                <a className="btn btn-primary movies-button" onClick={() =>this.handleFavourites(movieObj)}>{this.state.favourites.includes(movieObj.id)?"Remove From Favourites":"Add To Favourites"}</a>
                                            }
                                            </div>
                                        {/* </div> */}
                                    </div>
                                ))
                            }
                        </div>
                        {/* <div className="infinite-loader"style={{display:'flex',justifyContent:'center'}}>
                            <h2>Load More Movies .........................</h2>
                        </div> */}

                        {/* Below is the pagination design */}
                        <div style={{display:'flex',justifyContent:'center'}}>
                        <nav aria-label="Page navigation example">
                            <ul class="pagination">
                                {/* when clicked on left button handle in handle left function */}
                                <li class="page-item"><a class="page-link" onClick={this.handleLeft}>Previous</a></li>
                                {
                                    /* when clicked on any page number then handle in handle click function */
                                    this.state.parr.map((value)=>(
                                        <li class="page-item"><a class="page-link" onClick={()=>this.handleClick(value)}>{value}</a></li>
                                    ))
                                }
                                {/* when clicked on right button handle in handle right function */}
                                <li class="page-item"><a class="page-link" onClick={this.handleRight}>Next</a></li>
                            </ul>
                        </nav>
                        </div>
                    </div>
                }
            </>
        )
    }
}
