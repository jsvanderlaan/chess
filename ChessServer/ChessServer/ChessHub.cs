
using ChessServer.Entities;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChessServer
{
    public class ChessHub : Hub
    {
        private readonly GameState _gameState;

        public ChessHub(GameState gameState) => _gameState = gameState;

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("newGame", _gameState.WhitesTurn, _gameState.State.Reverse());
        }

        public async Task AddState(List<Piece> state)
        {
            _gameState.AddState(state);
            await Clients.All.SendAsync("newState", _gameState.WhitesTurn, state);
        }

        public async Task Restart()
        {
            _gameState.Restart();
            await Clients.All.SendAsync("newGame", _gameState.WhitesTurn, _gameState.State);
        }

    }
}
