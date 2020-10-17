using ChessServer.Entities.Factories;
using ChessServer.State;
using ChessServer.ViewModels.Factories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ChessServer
{
    public class Startup
    {
        private string _chessClientUrl;
        private const string _chessClientOrigin = "_chessClientOrigin";

        public Startup(IWebHostEnvironment env) => _chessClientUrl = env.IsProduction() ? "https://jurre.dev" : "http://localhost:4200";

        public void ConfigureServices(IServiceCollection services) =>
            services
                .AddSingleton<GameState>()
                .AddSingleton<UserState>()

                .AddSingleton<GameFactory>()
                .AddSingleton<GameViewModelFactory>()
                .AddSingleton<GameOverviewViewModelFactory>()
                .AddSingleton<UserViewModelFactory>()

                .AddCors(options =>
                    options.AddPolicy(
                        name: _chessClientOrigin,
                        builder =>
                            builder
                                .WithOrigins(_chessClientUrl)
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials()))

                .AddControllers().Services
                .AddSignalR();

        public void Configure(IApplicationBuilder app) =>
            app
                .UseRouting()
                .UseCors(_chessClientOrigin)
                .UseEndpoints(endpoints =>
                {
                    endpoints.MapHub<OverviewHub>("/overview");
                    endpoints.MapHub<GameHub>("/game");
                    endpoints.MapControllers();
                });
    }
}
