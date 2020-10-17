using ChessServer.State;
using Microsoft.AspNetCore.Mvc;

namespace ChessServer.Controllers
{
    [Route("user")]
    public class UserController : Controller
    {
        private readonly UserState _userState;
        private readonly GameState _gameState;

        public UserController(UserState userState, GameState gameState)
        {
            _userState = userState;
            _gameState = gameState;
        }

        [HttpGet]
        [Route("signup")]
        public void SignUp(string id, string name)
        {
            _userState.SignUp(id, name);
        }

        [HttpGet]
        [Route("joingame")]
        public void JoinGame(string gameId, string userId, bool white)
        {
            _gameState.AddUserToGame(gameId, userId, white);
        }
    }
}
