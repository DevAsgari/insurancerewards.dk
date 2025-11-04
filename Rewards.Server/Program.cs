using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Rewards.Server.Configuration;
using Rewards.Server.Data;
using Rewards.Server.Middleware;
using Rewards.Server.Repositories;
using Rewards.Server.Services;
using Rewards.Server.Strategies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSingleton<IRewardStrategyFactory, RewardStrategyFactory>();
builder.Services.AddScoped<RewardService>();
builder.Services.AddScoped<ISaleRepository, SaleRepository>();
builder.Services.AddAutoMapper(typeof(Program));

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "https://localhost:55992",  // Local Vite dev server
                "http://localhost:55992",
                "https://localhost:7174",   // Local backend
                "http://localhost:5230"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });

    // Production CORS - configure with your actual frontend URL
    options.AddPolicy("Production", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? new[] { "https://yourdomain.com" };

        policy.WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Health Checks (database check disabled for troubleshooting)
builder.Services.AddHealthChecks();
    // .AddDbContextCheck<SaleDbContext>();

// Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Rewards API",
        Description = "API for managing sales and calculating rewards"
    });
});

// EF Core - MySQL with fixed version (avoids connection during startup)
var serverVersion = new MySqlServerVersion(new Version(8, 0, 32));

builder.Services.AddDbContext<SaleDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        serverVersion
    ));

var app = builder.Build();

// Database migrations disabled - will run manually
// Apply database migrations automatically in production
// if (app.Environment.IsProduction())
// {
//     using (var scope = app.Services.CreateScope())
//     {
//         var dbContext = scope.ServiceProvider.GetRequiredService<SaleDbContext>();
//         try
//         {
//             dbContext.Database.Migrate();
//         }
//         catch (Exception ex)
//         {
//             var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
//             logger.LogError(ex, "An error occurred while migrating the database.");
//         }
//     }
// }

// Global exception handling
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

// Security Headers
// HSTS disabled for HTTP-only deployment on Simply.com
// if (app.Environment.IsProduction())
// {
//     app.UseHsts(); // HTTP Strict Transport Security
// }

// Static files - only needed for production deployment
// In development, frontend runs separately via Vite dev server
if (!app.Environment.IsDevelopment())
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Rewards API v1");
        options.RoutePrefix = "swagger";
    });
}

// Disabled HTTPS redirection for Simply.com deployment (HTTP only)
// app.UseHttpsRedirection();

// CORS - use different policies for development and production
app.UseCors(app.Environment.IsDevelopment() ? "AllowFrontend" : "Production");

app.UseAuthorization();

// Health Check endpoint
app.MapHealthChecks("/health");

app.MapControllers();

// SPA fallback - only needed if serving frontend from backend (production)
if (!app.Environment.IsDevelopment())
{
    app.MapFallbackToFile("/index.html");
}

app.Run();