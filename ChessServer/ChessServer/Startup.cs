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
                .AddCors(options =>
                    options.AddPolicy(
                        name: _chessClientOrigin,
                        builder =>
                            builder
                                .WithOrigins(_chessClientUrl)
                                .AllowCredentials()
                                .AllowAnyHeader()))
                .AddSignalR();

        public void Configure(IApplicationBuilder app) => 
            app
                .UseRouting()
                .UseCors(_chessClientOrigin)
                .UseEndpoints(endpoints => endpoints.MapHub<ChessHub>(""));
    }
}
