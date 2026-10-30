// DreamAuthorizationTests.cs
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;

namespace DreamTrackerAPI.Tests;

public class DreamAuthorizationTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public DreamAuthorizationTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetById_PrivateDreamOfAnotherUser_ReturnsNotFound()
    {
        // Seeded dream 5 is IsPublic = false and owned by the admin's UserProfile (Id 1).
        // The default test identity is Lucy (UserProfile Id 2).
        var response = await _client.GetAsync("/api/Dream/5");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetById_PrivateDreamOfAnotherUser_AsAdmin_ReturnsOk()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/Dream/5");
        request.Headers.Add(TestAuthHandler.RolesHeader, "Admin");
        request.Headers.Add(TestAuthHandler.IdentityHeader, TestAuthHandler.AdminIdentity);

        var response = await _client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetById_OwnPrivateDream_ReturnsOk()
    {
        // Seeded dream 8 is IsPublic = false and owned by Lucy's UserProfile (Id 2).
        var response = await _client.GetAsync("/api/Dream/8");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetById_PublicDream_ReturnsOk()
    {
        // Seeded dream 6 is public.
        var response = await _client.GetAsync("/api/Dream/6");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Update_AnotherUsersDream_ReturnsForbidden()
    {
        using var request = new HttpRequestMessage(HttpMethod.Put, "/api/Dream/5")
        {
            Content = JsonContent.Create(new
            {
                categoryId = 6,
                title = "Hijacked",
                content = "Should not be written.",
                isPublic = false,
                showAuthor = false,
                tagIds = new[] { 2 }
            })
        };

        var response = await _client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}
