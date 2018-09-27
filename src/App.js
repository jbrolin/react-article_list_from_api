import React, { Component } from "react";
//import logo from "./logo.svg";
import "./App.css";

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log("#####", url);
const orgList =  [];

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

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
    this.onReset = this.onReset.bind(this); // we need to bind 'this' if function is not an arrow function
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss=this.onDismiss.bind(this);

  }

  setSearchTopStories(result) {
    this.setState({ result });
  }



  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }


  onDismiss(id) {
    console.log("Dismiss"+id);
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits }  
    });
  }

  
  onReset() {
    // using non arrow function we need to bind the function to get access to 'this'.
    this.setState({ searchTerm: "" });

    // we need to copy the orginal list and resort it by objectID since the order of object are uncertain.
    
    const newOrgList = orgList.sort(function (a, b) {
      return a.objectID - b.objectID
    });

    this.setState({ list: newOrgList });

  }

  onSortTitle = () => {
    const updatedList = this.state.list.sort(function (a, b) {
      var x = a.title.toLowerCase();
      var y = b.title.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
    this.setState({ list: updatedList });
    console.log(this.state.list);
  }

  onSortAuthor = () => {
    const updatedList = this.state.list.sort(function (a, b) {
      var x = a.author.toLowerCase();
      var y = b.author.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
    this.setState({ list: updatedList });
    console.log(this.state.list);
  }



  render() {
    const { searchTerm, result } = this.state; // destructing values from this.state
    console.log("get", this.state, result);

    if (!result) { return null; }
   
    return (
      <div className="page">
      { result && 
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
            onReset={this.onReset}
          />
          <Button onClick={() => this.onReset()}>
            Reset list
        </Button>

          <Button onClick={() => this.onSortTitle()}>
            Sort list by title
        </Button>

          <Button onClick={() => this.onSortAuthor()}>
            Sort list by author
        </Button>

        </div>
        
      </div>
    );
  }
}

const Search = ({ value, onChange, onReset }) =>
  <form>
    Filter:
          <input
      value={value} // using the string as value in the html-form makes it a controlled component, 
      // that is the string is now the "single source of truth" 
      type="text"
      onChange={onChange}
    />
  </form>

const Table = ({ list, pattern, onDismiss }) =>

  <div className="table">
    {list.filter(isSearched(pattern)).map(item => (
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
