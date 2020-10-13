using ChessServer.Entities;
using System.Collections.Generic;

namespace ChessServer
{
    public class Game
    {
        private readonly Position _startingPosition; 
        public List<Position> Positions { get; set; }
        public bool WhitesTurn { get; set; }
        public string WhiteUserId { get; set; }
        public string BlackUserId { get; set; }

        public Game(Position startingPosition)
        {
            _startingPosition = startingPosition;
            Restart();
        }

        public void AddPosition(Position state)
        {
            Positions.Add(state);
            WhitesTurn = !WhitesTurn;
        }

        public void Restart()
        {
            Positions = new List<Position> { _startingPosition };
            WhitesTurn = true;
        }
    }
}
