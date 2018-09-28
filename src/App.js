import React, { Component } from "react";
//import logo from "./logo.svg";
import "./App.css";

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '10';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
console.log("#####", url);
const orgList =  [];



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //list: list,
      //textFields: textFields,
      result: null,
      searchTerm: DEFAULT_QUERY,

    };
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
   
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss=this.onDismiss.bind(this);
    this.onSearchSubmit=this.onSearchSubmit.bind(this);
  }

  onSearchSubmit(event){
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault(); // prevent default behaviour in this case do not reload page
  }
  setSearchTopStories(result) {
    const {hits,page} = result;
    console.log("hits",hits, page);
    const oldHits = page !== 0
      ? this.state.result.hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({ 
      result :{hits: updatedHits, page}
      });
  }



  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  fetchSearchTopStories(searchTerm, page=0){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);

  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }


  onDismiss(id) {
    console.log("Dismiss"+id);
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits }  
    });
  }

  
  



  render() {
    const { searchTerm, result } = this.state; // destructing values from this.state
    const page = (result && result.page) || 0;
    console.log("get", this.state, result);

    //if (!result) { return null; }
   
    return (
      <div className="page">
      
      { result && /* we use ' {result && ... }' which will show the table if result has data if not it shows nothing (called conditional rendering) */
      <Table
      list={result.hits}
      pattern={searchTerm}
      onDismiss={this.onDismiss}
      />
      
      }
      
           <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            onReset={this.onReset}
          >
          Search
          </Search>

          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page+1)}>
          Show more
          </Button>
        

        </div>
        
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    Filter:
          <input
      type="text"
      value={value} // using the string as value in the html-form makes it a controlled component, 
      // that is the string is now the "single source of truth" 
      onChange={onChange}
    />
    <button type="submit">
    {children}
    </button>
  </form>

const Table = ({ list, onDismiss }) =>

  <div className="table">
    {list.map(item => (
      <div key={item.objectID} className="table-row">
        <span className="largeColumn">
          <a href={item.url} target="_new">
            {item.title}
          </a>
        </span>
        <span className="midColumn">
          {item.author}
        </span>
        <span className="smallColumn">
          {item.num_comments}
        </span>
        <span className="smallColumn">
          {item.points}
        </span>
        <span style={{ width: '10%' }}>
          <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
            <b>Do</b> Dismiss
              </Button>
        </span>
      </div>
    ))}
  </div>

const Button = ({ onClick, className = '', children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>


export default App;
