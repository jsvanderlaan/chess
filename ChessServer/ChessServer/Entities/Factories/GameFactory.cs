using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace ChessServer.Entities.Factories
{
    public class GameFactory
    {
        private readonly Position _startingPosition;

        public GameFactory(IConfiguration config)
        {
            var startingPieces = config["StartingPieces"];
            _startingPosition = JsonConvert.DeserializeObject<Position>(startingPieces);
        }

        public Game NewGame() => new Game(_startingPosition);
    }
}
