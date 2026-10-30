// FavoritesControllerTests.cs
using System.Net;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using DreamTrackerAPI;
using DreamTrackerAPI.Data;
using DreamTrackerAPI.Models;

namespace DreamTrackerAPI.Tests;

public class FavoritesControllerTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public FavoritesControllerTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetFavorites_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/Favorite/mine");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetFavorites_RequiresAuthentication()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/Favorite/mine");
        request.Headers.Add(TestAuthHandler.AnonymousHeader, "true");

        var response = await _client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CreateFavorite_ForOtherUsersPrivateDream_ReturnsNotFound()
    {
        // Seeded dream 5 is IsPublic = false and owned by the admin's UserProfile (Id 1).
        // The default test identity is Lucy (UserProfile Id 2).
        var response = await _client.PostAsJsonAsync(
            "/api/Favorite", new { dreamId = 5 });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetFavorites_DoesNotLeakOtherUsersPrivateDream()
    {
        // Seeded dream 5 is IsPublic = false and owned by the admin's UserProfile (Id 1).
        // Favorable it directly in the store to simulate pre-existing state.
        await SeedFavoriteAsync(userProfileId: 2, dreamId: 5);

        var response = await _client.GetAsync("/api/Favorite/mine");
        var body = await response.Content.ReadAsStringAsync();

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        body.Should().NotContain("Being chased but never caught");
        body.Should().NotContain("The more I run, the slower I move");
    }

    [Fact]
    public async Task GetFavorites_MasksAuthorWhenShowAuthorIsFalse()
    {
        // Seeded dream 6 is public but has ShowAuthor = false.
        await SeedFavoriteAsync(userProfileId: 2, dreamId: 6);

        var response = await _client.GetAsync("/api/Favorite/mine");
        var body = await response.Content.ReadAsStringAsync();

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        body.Should().Contain("\"publishedBy\":\"Anonymous\"");
    }

    private static async Task SeedFavoriteAsync(int userProfileId, int dreamId)
    {
        var factory = new CustomWebApplicationFactory<Program>();
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DreamTrackerDbContext>();

        if (!db.Favorites.Any(f => f.UserProfileId == userProfileId && f.DreamId == dreamId))
        {
            db.Favorites.Add(new Favorite
            {
                UserProfileId = userProfileId,
                DreamId = dreamId,
                FavoritedOn = new DateTime(2024, 10, 10)
            });
            await db.SaveChangesAsync();
        }
    }
}
