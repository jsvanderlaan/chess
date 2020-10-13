using ChessServer.ViewModels;
using System.Linq;

namespace ChessServer.ViewModels.Factories
{
    public class GameOverviewViewModelFactory
    {
        private readonly GameViewModelFactory _gameViewModelFactory;

        public GameOverviewViewModelFactory(GameViewModelFactory gameViewModelFactory)
        {
            _gameViewModelFactory = gameViewModelFactory;
        }

        public GameOverviewViewModel Get(string gameId)
        {
            var game = _gameViewModelFactory.Get(gameId);

            return new GameOverviewViewModel()
            {
                Position = game.Positions.Last(),
                WhiteUser = game.WhiteUser,
                BlackUser = game.BlackUser,
                Id = gameId
            };
        }
    }
}
