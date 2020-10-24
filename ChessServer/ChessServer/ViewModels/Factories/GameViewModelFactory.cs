using ChessServer.State;
using System.Linq;

namespace ChessServer.ViewModels.Factories
{
    public class GameViewModelFactory
    {
        private readonly GameState _gameState;
        private readonly UserViewModelFactory _userViewModelFactory;

        public GameViewModelFactory(GameState gameState, UserViewModelFactory userViewModelFactory)
        {
            _gameState = gameState;
            _userViewModelFactory = userViewModelFactory;
        }

        public GameViewModel Get(string gameId)
        {
            var game = _gameState.Get(gameId);

            if(game == null)
            {
                return null;
            }

            var whiteUser = _userViewModelFactory.Get(game.WhiteUserId);
            var blackUser = _userViewModelFactory.Get(game.BlackUserId);

            return new GameViewModel()
            {
                Positions = game.Positions.ToList(),
                WhitesTurn = game.WhitesTurn,
                WhiteUser = whiteUser,
                BlackUser = blackUser
            };
        }
    }
}
