using ChessServer.State;
using ChessServer.ViewModels.Factories;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System.Threading.Tasks;

namespace ChessServer
{
    public class OverviewHub : Hub
    {
        private readonly GameState _gameState;
        private readonly GameOverviewViewModelFactory _gameOverviewViewModelFactory;

        public OverviewHub(GameState gameState, GameOverviewViewModelFactory gameOverviewViewModelFactory)
        {
            _gameState = gameState;
            _gameOverviewViewModelFactory = gameOverviewViewModelFactory;
        }

        public async Task Subscribe()
        {
            var gameList = _gameState.GetAllIds().Select(_gameOverviewViewModelFactory.Get).ToList();

            await Clients.Caller.SendAsync("GameList", gameList);
        }

        public async Task NewGame()
        {
            var gameId = _gameState.NewGame();

            var game = _gameOverviewViewModelFactory.Get(gameId);
            await Clients.All.SendAsync("NewGame", game);
        }

        public async Task DeleteGame(string gameId)
        {
            _gameState.Delete(gameId);
            await Clients.All.SendAsync("DeleteGame", gameId);
        }
    }
}
