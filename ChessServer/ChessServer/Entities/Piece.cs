namespace ChessServer.Entities
{
    public class Piece
    {
        public string Type { get; set; }
        public int Row { get; set; }
        public int Col { get; set; }
        public bool Taken { get; set; }
        public string Color { get; set; }
        public bool Moved { get; set; }
    }
}
