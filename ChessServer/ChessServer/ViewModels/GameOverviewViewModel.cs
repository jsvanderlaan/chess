using ChessServer.Entities;

namespace ChessServer.ViewModels
{
    public class GameOverviewViewModel
    {
        public Position Position { get; set; }
        public UserViewModel WhiteUser { get; set; }
        public UserViewModel BlackUser { get; set; }
        public string Id { get; set; }
    }
}
