using ChessServer.Entities;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace ChessServer.State
{
    public class UserState
    {
        private readonly IDictionary<string, User> _users = new ConcurrentDictionary<string, User>();

        public void SignUp(string id, string name)
        {
            if (!_users.ContainsKey(id))
            {
                _users.TryAdd(id, new User());
            }

            var user = _users[id];
            user.Name = name;
        }

        public User Get(string userId)
        {
            return userId != null && _users.ContainsKey(userId) ? _users[userId] : null;
        }
    }
}
