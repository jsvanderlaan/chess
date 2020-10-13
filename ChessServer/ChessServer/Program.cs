using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace ChessServer
{
    public class Program
    {
        public static void Main() => 
            CreateWebHostBuilder().Build().Run();

        public static IWebHostBuilder CreateWebHostBuilder() => 
            WebHost.CreateDefaultBuilder().UseStartup<Startup>();
            
    }
}
