using ChessServer.State;
using ChessServer.ViewModels;

namespace ChessServer.ViewModels.Factories
{
    public class UserViewModelFactory
    {
        private readonly UserState _userState;

        public UserViewModelFactory(UserState userState)
        {
            _userState = userState;
        }

        public UserViewModel Get(string userId)
        {
            var user = _userState.Get(userId);
            return user != null ? new UserViewModel
            {
                Name = user.Name,
                Id = userId
            } : null;
        }
    }
}
