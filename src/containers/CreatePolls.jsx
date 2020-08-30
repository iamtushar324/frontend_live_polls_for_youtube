import React from "react";

class CreatePolls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Poll Options",
      options: [],
      startTime: null,
      live: false,
      countedLength: 0
    };
    setInterval(this.checkResult, 2000);
  }

  addOption = e => {
    if (e.key === "Enter") {
      let option = {
        name: e.target.value,
        count: 0
      };
      e.target.value = "";

      let arr = this.state.options;
      arr.push(option);
      this.setState({ options: arr });
    }
  };

  checkResult = () => {
    let ChatsData = this.props.items;
    let OptimizedData = ChatsData.slice(this.state.countedLength, ChatsData.length);

    OptimizedData.map(chat => {
      let NewOptionsData = this.state.options;
      NewOptionsData.map(e => {
        if (chat.snippet.displayMessage === e.name) {
          e.count++;
        }
      });
      this.setState({ options: NewOptionsData, countedLength: ChatsData.length });
    });
  };

  render() {
    return (
      <div className="create_poll_con">
        <h1>{this.state.title}</h1>
        <button
          onClick={() => {
            this.setState({ options: [] });
          }}
        >
          Clear All Options
        </button>
        <input placeholder="Add Option" onKeyDown={this.addOption} />
		<div className="options">
        {this.state.options.map(e => {
          return (
            <div className="op">
              {" "}
              <h1>{e.name}</h1>
              <h4>{e.count}</h4>{" "}
            </div>
          );
        })}
			</div>
      </div>
    );
  }
}

export default CreatePolls;
