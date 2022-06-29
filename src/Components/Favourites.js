import React, { Component } from 'react'
import { movies } from './getMovies'

// As we are using class component, Class name is provided which will extend Component class present in our react 
export default class Favourites extends Component {
    // Now in constructor we will define states
    constructor(){
        // super is used so that parent constructor will be called
        super();
        //  now we will define states
        this.state={
            // genre array will store the information of movies of particular genre
            genres:[],
            // user can change the genre, by default all genres will be selected
            currgen:'All Genres',
            // movies array will store all the movies
            movies:[],
            // currtext will store the status of the keywords being used for searching
            currText:'',
            // user can change the number of movies want to see per page, limit is storing the same
            limit:5,
            // curr page will store the status of the curr page in pagination
            currPage:1
        }
    }
    // The componentDidMount() method allows us to execute the React code when the component is already placed in the DOM (Document Object Model). 
    // This method is called during the Mounting phase of the React Life-cycle i.e after the component is rendered.
    // componentDidMount() is invoked immediately after a component is mounted (inserted into the tree)
    componentDidMount(){
        // This is the information provide by AMDB website, we have stored it in an array 
        let genreids = {28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
                        27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',10770:'TV',53:'Thriller',10752:'War',37:'Western'};
        
        // Here  we will check if some data already saved in local storage or not, according to which we will update our
        // genre array and movies array, by default genre array will contain all genres
                        let data = JSON.parse(localStorage.getItem("movies-app") || "[]")
        let temp = []
        data.forEach((movieObj)=>{
            if(!temp.includes(genreids[movieObj.genre_ids[0]])){
                temp.push(genreids[movieObj.genre_ids[0]]);
            }
         })
        //  unshift will add element in the front of the array
         temp.unshift('All Genres');
         this.setState({
             genres:[...temp],
             movies:[...data]
         })
    }
    // User have the option to change the genre, this function will maintain the state of the genre by updating currgen state
    handleGenreChange = (genre) => {
        this.setState({
            currgen : genre
        })
    }
    //  User can change the priority of popularity either ascending to descending or vice versa
    //  we have sorted our array and provided the definition to sort
    //  finally we will update our movies array
    sortPopularityDesc=()=>{
        let temp = this.state.movies;
        temp.sort(function(objA,objB){
            return objB.popularity-objA.popularity;
        })
        this.setState({
            movies:[...temp]
        })
    }
    //  User can change the priority of popularity either ascending to descending or vice versa
    //  we have sorted our array and provided the definition to sort
    //  finally we will update our movies array
    sortPopularityAsc=()=>{
        let temp = this.state.movies;
        temp.sort(function(objA,objB){
            return objA.popularity-objB.popularity;
        })
        this.setState({
            movies:[...temp]
        })
    }
    //  User can change the priority of rating either ascending to descing or vice versa
    //  we have sorted our array and provided the definition to sort
    //  finally we will update our movies array
    sortRatingDesc=()=>{
        let temp = this.state.movies;
        temp.sort(function(objA,objB){
            return objB.vote_average-objA.vote_average;
        })
        this.setState({
            movies:[...temp]
        })
    }
    //  User can change the priority of rating either ascending to descing or vice versa
    //  we have sorted our array and provided the definition to sort
    //  finally we will update our movies array
    sortRatingAsc=()=>{
        let temp = this.state.movies;
        temp.sort(function(objA,objB){
            return objA.vote_average-objB.vote_average;
        })
        this.setState({
            movies:[...temp]
        })
    }
    //  This function will update the status of curr page whenpage user will select any page in pagination tab
    handlePageChange=(page)=>{
        this.setState({
            currPage:page
        })
    }
    // Here user can also delete movies from favourites which is stored in the local storage
    // simply we will remove the particular movie and update our local storage along with the movies array
    handleDelete = (id) => {
        let newArr = [];
        newArr = this.state.movies.filter((movieObj)=>movieObj.id!==id)
        this.setState({
            movies:[...newArr]
        })
        localStorage.setItem("movies-app",JSON.stringify(newArr));
    }
    // React renders HTML to the web page by using a function called render().
// The purpose of the function is to display the specified HTML code inside the specified HTML element.
// In the render() method, we can read props and state and return our JSX code to the root component of our app.
// In the render() method, we cannot change the state, and we cannot cause side effects( such as making an HTTP request to the webserver).
    render() {
        // const movie = movies.results;
        let genreids = {28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
        27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',10770:'TV',53:'Thriller',10752:'War',37:'Western'};
        // Here we are checking, if user has searched something through search bar according to which we are maintaining our filter array
        let filterarr = [];
        if(this.state.currText===''){
            filterarr = this.state.movies;
        }else{
            filterarr = this.state.movies.filter((movieObj)=>{
                let title = movieObj.original_title.toLowerCase();
                return title.includes(this.state.currText.toLowerCase())
            })
        }

        // if(this.state.currgen=="All Genres"){
        //     filterarr = this.state.movies
        // }
        // Similarily we will check if genre is selected other than all genres then also we need to modify our filter array
        if(this.state.currgen!=="All Genres"){
            filterarr = this.state.movies.filter((movieObj) =>genreids[movieObj.genre_ids[0]]===this.state.currgen);
        }
        // To calculate total number of pages we will divide our filter array length from provided limit
        let pages = Math.ceil(filterarr.length/this.state.limit);
        let pagesarr = [];
        // And then we will update page array with that many pages
        for(let i=1;i<=pages;i++){
            pagesarr.push(i);
        }
        // Maintaining starting and ending index on the basis of provided limit
        //  and selecting the movies in this range only from the filter array
        let si = (this.state.currPage-1)*this.state.limit;
        let ei = si+this.state.limit;
        filterarr = filterarr.slice(si,ei);
        return (
            <div>
                <>
                <div className='main'>
                    <div className="row">
                        <div className="col-lg-3 col-sm-12">
                            <ul class="list-group favourites-genres">
                                {
                                    // To distinguish selected and non selected genre below code is designed
                                    this.state.genres.map((genre) => (
                                        this.state.currgen == genre ?
                                        <li class="list-group-item" style={{background:'#82ccdd',color:'white',fontWeight:'bold'}}>{genre}</li> :
                                        <li class="list-group-item" style={{background:'white',color:'#82ccdd'}} onClick={() => this.handleGenreChange(genre)} >{genre}</li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="col-lg-9 favourites-table col-sm-12">
                            <div className="row">
                                {/* Below are the two input tags for seacrh amd limit from their values only we are updating currText and limit */}
                            <input type="text" className="input-group-text col" placeholder="Search" value={this.state.currText} onChange={(e) => this.setState({currText:e.target.value})}/>
                            <input type="number" className="input-group-text col" placeholder="Rows Count" value={this.state.limit} onChange={(e) => this.setState({limit:e.target.value})}/>
                            </div>
                            <div className="row">
                                {/* We will show all the information of movies in form of a table  containing columns for image, title, genre, popularity, rating and one button to delete*/}
                                    <table class="table">
                                    <thead>
                                        <tr>
                                        <th scope="col">Title</th>
                                        <th scope="col">Genre</th>
                                        <th scope="col"><i class="fas fa-caret-up" onClick={this.sortPopularityDesc}/>Popularity<i class="fas fa-caret-down" onClick={this.sortPopularityAsc}/></th>
                                        <th scope="col"><i class="fas fa-caret-up" onClick={this.sortRatingDesc}/>Rating<i class="fas fa-caret-down" onClick={this.sortRatingAsc}/></th>
                                        <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            filterarr.map((movieObj) => (
                                                <tr>
                                                    <td><img src={`https://image.tmdb.org/t/p/original${movieObj.backdrop_path}`} alt={movieObj.title} style={{width:'8rem'}}/> {movieObj.original_title}</td>
                                                    <td>{genreids[movieObj.genre_ids[0]]}</td>
                                                    <td>{movieObj.popularity}</td>
                                                    <td>{movieObj.vote_average}</td>
                                                    <td><button type="button" class="btn btn-warning" onClick={() => this.handleDelete(movieObj.id)} >Delete</button> </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                    </table>
                            </div>
                            {/* Pagination code */}
                            <nav aria-label="Page navigation example">
                                    <ul class="pagination">
                                        {
                                            pagesarr.map((page) => (
                                                <li class="page-item"><a class="page-link" onClick={()=>this.handlePageChange(page)}>{page}</a></li>
                                            ))
                                        }
                                    </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                </>
            </div>
        )
    }
}
