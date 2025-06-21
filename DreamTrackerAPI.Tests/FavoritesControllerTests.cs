// FavoritesControllerTests.cs
using System.Net;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using DreamTrackerAPI;

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
        var response = await _client.GetAsync("/api/Favorites");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
