using ChessServer.Entities;
using System.Collections.Generic;

namespace ChessServer.ViewModels
{
    public class GameViewModel
    {
        public List<Position> Positions { get; set; }
        public bool WhitesTurn { get; set; }
        public UserViewModel WhiteUser { get; set; }
        public UserViewModel BlackUser { get; set; }
    }
}
