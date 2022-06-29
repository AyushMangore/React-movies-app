import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import Banner from './Components/Banner';
import Movies from './Components/Movies';
import Favourites from './Components/Favourites';
import {BrowserRouter as Router,Routes,Route, BrowserRouter} from 'react-router-dom';
import React from 'react';
import { Fragment } from 'react';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
      <Route path="/" element={[<Banner/>,<Movies/>]} />
        {/* <Route path='/' exact render={(props)=>(
            <>
              <Banner {...props}/>
              <Movies {...props}/>
            </>
          )}/> */}
        
      <Route path='/favourites' element={<Favourites/>} />
          
      </Routes>
      {/* <Banner/> */}
      {/* <Movies/> name="udai" */}
      {/* <Favourite/> */}
    </Router>
  );
}
export default App;
