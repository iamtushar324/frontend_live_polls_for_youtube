import React from "react";
import CreatePolls from "./containers/CreatePolls";

const client_id = "1066575777882-vr6932qlv90h2tknvkkm2nil62nh878o.apps.googleusercontent.com";

window.gapi.load("client:auth2", function () {
  window.gapi.auth2.init({
    client_id: client_id
  });
});
class App extends React.Component {
  authenticate = () => {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
      .then(
        function () {
          console.log("Sign-in successful");
        },
        function (err) {
          console.error("Error signing in", err);
        }
      );
  };

  loadClient = () => {
    window.gapi.client.setApiKey("AIzaSyDeoDTN7XYXp_rCwj0Mwume2nbNP_cnM4c");
    return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest").then(
      function () {
        console.log("GAPI client loaded for API");
      },
      function (err) {
        console.error("Error loading GAPI client for API", err);
      }
    );
  };

  executeGet = () => {
    return window.gapi.client.youtube.liveBroadcasts
      .list({
        part: ["snippet,contentDetails,status"],
        broadcastStatus: "active",
        broadcastType: "all"
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
          return response;
        },
        function (err) {
          console.error("Execute error", err);
        }
      );
  };

  execute = chatId => {
    return window.gapi.client.youtube.liveChatMessages
      .list({
        liveChatId: chatId,
        part: ["snippet,authorDetails"],
        maxResults: 1000
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
          return response;
        },
        function (err) {
          console.error("Execute error", err);
          return { error: "Not Found" };
        }
      );
  };

  constructor(props) {
    super(props);
    this.state = {
      chatId: null,
      items: [],
      ChatsData: [],
      live: false,
      reading: false
    };
  }
  updateChats = () => {
    if (this.state.chatId) {
      this.setState({ reading: true });
      let LiveChatsDataInterval = setInterval(async () => {
        if (this.state.live === false || this.state.reading === false) {
          clearInterval(LiveChatsDataInterval);
        }
        try {
          console.log("workign");

          let ChatsData = await this.execute(this.state.chatId);
          if (ChatsData.result) {
            this.setState({ ChatsData: ChatsData.result.items });
          } else {
            clearInterval(LiveChatsDataInterval);
            this.setState({ live: false, reading: false });
          }
        } catch (err) {
          alert(err);
        }
      }, 2000);
    }
  };

  render() {
    return (
      <div className="App">
        {!this.state.chatId && (
          <>
            <h1>Welcome To Youtube Stream Live Polls</h1>
            <button
              onClick={async () => {
                try {
                  let auth = await this.authenticate();
                  let Client = await this.loadClient();
                  let broadcastStatus = await this.executeGet();
                  console.log(broadcastStatus);
                  if (broadcastStatus) {
                    if (broadcastStatus.result) {
                      this.setState({
                        items: broadcastStatus.result.items
                      });
                    }
                  }
                } catch (err) {
                  console.log(err);
                  alert("Unable To Authorize With Youtube Account!");
                }
              }}
            >
              Authorize Your Youtube Account
            </button>
          </>
        )}
        {this.state.items.length === 0 && <h1 className="no">No Live Stream Found</h1>}
        {this.state.items.map((e, i) => {
          return (
            <div className="stream_con" key={i}>
              <h1>{e.snippet.title}</h1>
              <img src={e.snippet.thumbnails.medium.url}></img>
			  <br/>
              {this.state.chatId !== e.snippet.liveChatId && (
                <button
                  onClick={() => {
                    this.setState({ chatId: e.snippet.liveChatId, live: true });
                  }}
                >
                  Use This Stream
                </button>
              )}
              {this.state.chatId && !this.state.reading && (
                <button
                  onClick={() => {
                    this.updateChats();
                  }}
                >
                  Start Reading Response
                </button>
              )}
              {this.state.reading && (
                <button
                  onClick={() => {
                    this.setState({ reading: false });
                  }}
                >
                  Stop Reading Response
                </button>
              )}
              <div className={this.state.reading ? "status green" : "status red"}></div>
            </div>
          );
        })}
			{this.state.chatId &&
        <CreatePolls items={this.state.ChatsData} />
		}
      </div>
    );
  }
}
export default App;
