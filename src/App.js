import React from "react";

const client_id =
  "1059529825547-2a9d05qrb62l58r79gtd6clkks48h3lo.apps.googleusercontent.com";

window.gapi.load("client:auth2", function () {
  window.gapi.auth2.init({
    client_id: client_id,
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
    window.gapi.client.setApiKey("AIzaSyCtfpv3z5o_834hmVRrqqAi_7f_hVw2QPg");
    return window.gapi.client
      .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(
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
        broadcastType: "all",
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

  execute = (chatId) => {
    return window.gapi.client.youtube.liveChatMessages
      .list({
        liveChatId: chatId,
        part: ["snippet,authorDetails"],
        maxResults: 1000,
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
        },
        function (err) {
          console.error("Execute error", err);
        }
      );
  };

  constructor(props) {
    super(props);
    this.state = {
      chatId: null,
      items: [],
    };
  }

  render() {
    return (
      <div className="App">
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
                  this.setState({ items: broadcastStatus.result.items });
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
        {this.state.items.map((e, i) => {
          return (
            <div key={i}>
              <img src={e.snippet.thumbnails.default.url}></img>
              <button
                onClick={() => {
                  this.execute(e.snippet.liveChatId);
                }}
              >
                Get Chats
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}
export default App;
