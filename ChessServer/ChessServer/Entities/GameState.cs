using ChessServer.Entities;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace ChessServer
{
    public class GameState
    {
        private List<Piece> _startingPieces;

        public GameState(IConfiguration config)
        {
            var startingPieces = config["StartingPieces"];
            _startingPieces = JsonConvert.DeserializeObject<List<Piece>>(startingPieces);
            State.Push(_startingPieces);
        }

        public Stack<List<Piece>> State { get; set; } = new Stack<List<Piece>>();
        public bool WhitesTurn { get; set; } = true;

        public void AddState(List<Piece> state)
        {
            State.Push(state);
            WhitesTurn = !WhitesTurn;
        }

        public void Restart()
        {
            State = new Stack<List<Piece>>();
            State.Push(_startingPieces);
            WhitesTurn = true;
        }
    }
}
