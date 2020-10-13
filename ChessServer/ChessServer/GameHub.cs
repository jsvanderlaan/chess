using ChessServer.Entities;
using ChessServer.State;
using ChessServer.ViewModels.Factories;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System.Threading.Tasks;

namespace ChessServer
{
    public class GameHub : Hub
    {
        private readonly GameState _gameState;
        private readonly UserState _userState;
        private readonly GameViewModelFactory _gameViewModelFactory;
        private readonly IHubContext<OverviewHub> _overviewHubContext;

        public GameHub(GameState gameState, UserState userState, GameViewModelFactory gameViewModelFactory, IHubContext<OverviewHub> overviewHubContext)
        {
            _gameState = gameState;
            _userState = userState;
            _gameViewModelFactory = gameViewModelFactory;
            _overviewHubContext = overviewHubContext;
        }

        public async Task Subscribe(string gameId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
            var game = _gameViewModelFactory.Get(gameId);
            await Clients.Caller.SendAsync("GameState", game);
        }

        public async Task AddPosition(string gameId, Position position)
        {
            _gameState.NewGamePosition(gameId, position);

            var game = _gameState.Get(gameId);
            await Clients.Group(gameId).SendAsync("AddPosition", position, game.WhitesTurn);
            await _overviewHubContext.Clients.All.SendAsync("NewPosition", position, gameId);
        }

        public async Task Restart(string gameId)
        {
            _gameState.RestartGame(gameId);

            var game = _gameViewModelFactory.Get(gameId);
            await Clients.Group(gameId).SendAsync("GameState", game);
            await _overviewHubContext.Clients.All.SendAsync("NewPosition", game.Positions.Last(), gameId);
        }
    }
}
