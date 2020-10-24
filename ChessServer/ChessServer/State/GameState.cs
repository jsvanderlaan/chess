using ChessServer.Entities;
using ChessServer.Entities.Factories;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace ChessServer.State
{
    public class GameState
    {
        private readonly IDictionary<string, Game> _games = new ConcurrentDictionary<string, Game>();
        private readonly GameFactory _gameFactory;

        public GameState(GameFactory gameFactory)
        {
            _gameFactory = gameFactory;
        }

        public void RestartGame(string gameId)
        {
            if (!_games.ContainsKey(gameId))
            {
                return;
            }

            _games[gameId].Restart();
        }

        public void NewGamePosition(string gameId, Position position)
        {
            if (!_games.ContainsKey(gameId))
            {
                return;
            }

            _games[gameId].AddPosition(position);
        }

        public Game Get(string gameId)
        {
            return _games.ContainsKey(gameId) ? _games[gameId] : null;
        }

        public IReadOnlyCollection<string> GetAllIds()
        {
            return _games.Keys.ToImmutableList();
        }

        public IReadOnlyCollection<string> GetUserGames(string userId)
        {
            return _games
                .Where(keyValuePair => keyValuePair.Value.WhiteUserId == userId || keyValuePair.Value.BlackUserId == userId)
                .Select(keyValuePair => keyValuePair.Key)
                .ToList();
        }

        public void Delete(string gameId)
        {
            if (!_games.ContainsKey(gameId))
            {
                return;
            }

            _games.Remove(gameId);
        }

        public string NewGame()
        {
            var gameId = Guid.NewGuid().ToString();
            var game = _gameFactory.NewGame();
            _games.Add(gameId, game);

            return gameId;
        }

        public void AddUserToGame(string gameId, string userId, bool white)
        {
            if (!_games.ContainsKey(gameId))
            {
                return;
            }

            var game = _games[gameId];

            if (white && string.IsNullOrWhiteSpace(game.WhiteUserId))
            {
                game.WhiteUserId = userId;
                return;
            }

            if (!white && string.IsNullOrWhiteSpace(game.BlackUserId))
            {
                game.BlackUserId = userId;
                return;
            }
        }
    }
}
