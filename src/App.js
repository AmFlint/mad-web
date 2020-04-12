import React from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3000');

class App extends React.Component {
  state = {
    clients: []
  };

  componentDidMount() {
    socket.on('load_clients', (clients) => {
      this.setState({ clients: [...clients] });
    });

    socket.on('web_client_disconnect', (clientID) => {
      this.setState({
        clients: this.state.clients.filter(c => c.id !== clientID),
      })
    })

    socket.on('web_client_update', client => {
      let newClients = [];
      const { clients } = this.state;
      if (!clients.find(c => c.socketID === client.socketID)) {
        newClients = [...clients, { ...client }];
      } else {
        newClients = clients.map(c => ({
          ...c,
          health: client.id === c.id ? {...client.health} : {...c.health}
        }));
      }
      this.setState({ clients: newClients });
    })

    socket.emit('web_connected');
  }

  render() {
    return (
      <div className="App">
        {
          this.state.clients.map(client => (
            <div key={client.socketID}>
              <h2>Client ID: {client.id}</h2>
              <h3>Storage: {client.health.storage}</h3>
              <h3>Network: {client.health.network}</h3>
            </div>
          ))
        }
      </div>
    );
  }
}

export default App;
