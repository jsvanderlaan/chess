using ChessServer.State;
using ChessServer.ViewModels.Factories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ChessServer.Controllers
{
    [Route("user")]
    public class UserController : Controller
    {
        private readonly UserState _userState;
        private readonly GameState _gameState;
        private readonly IHubContext<OverviewHub> _overviewHubContext;
        private readonly IHubContext<GameHub> _gameHubContexst;
        private readonly GameViewModelFactory _gameViewModelFactory;

        public UserController(UserState userState, GameState gameState, IHubContext<OverviewHub> overviewHubContext, IHubContext<GameHub> gameHubContexst, GameViewModelFactory gameViewModelFactory)
        {
            _userState = userState;
            _gameState = gameState;
            _overviewHubContext = overviewHubContext;
            _gameHubContexst = gameHubContexst;
            _gameViewModelFactory = gameViewModelFactory;
        }

        [HttpGet]
        [Route("signup")]
        public async Task SignUp(string id, string name)
        {
            _userState.SignUp(id, name);

            var userGames = _gameState.GetUserGames(id);
            foreach(var gameId in userGames)
            {
                await UpdateUsers(gameId);
            }
        }

        [HttpGet]
        [Route("joingame")]
        public async Task JoinGame(string gameId, string userId, bool white)
        {
            _gameState.AddUserToGame(gameId, userId, white);
            await UpdateUsers(gameId);
        }

        private async Task UpdateUsers(string gameId)
        {
            var game = _gameViewModelFactory.Get(gameId);
            await _gameHubContexst.Clients.Group(gameId).SendAsync("UserUpdate", game.WhiteUser, game.BlackUser);
            await _overviewHubContext.Clients.All.SendAsync("UserUpdate", gameId, game.WhiteUser, game.BlackUser);
        }
    }
}
