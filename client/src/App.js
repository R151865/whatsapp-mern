import { Component } from "react";
import React from "react";

export default class App extends Component {
  state = {
    users: [],
  };
  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const response = await fetch("/api");
    const data = await response.json();
    this.setState({ users: data.users });
  };

  render() {
    const { users } = this.state;
    return (
      <ul>
        {users.map((each) => (
          <li key={each}>{each}</li>
        ))}
      </ul>
    );
  }
}
