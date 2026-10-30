// DreamAuthorizationTests.cs
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using DreamTrackerAPI.Models.DTOs;

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
    public async Task GetById_AnotherUsersPrivateDream_AsAdmin_ReturnsOk()
    {
        // Seeded dream 8 is IsPublic = false and owned by Lucy's UserProfile (Id 2),
        // so it exercises the admin bypass rather than the owner check.
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/Dream/8");
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

    [Fact]
    public async Task GetAll_AsAdmin_IncludesAnotherUsersPrivateDream()
    {
        // Seeded dream 8 is IsPublic = false and owned by Lucy's UserProfile (Id 2).
        // Admins must still see it in the list so the admin delete buttons remain usable.
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/Dream");
        request.Headers.Add(TestAuthHandler.RolesHeader, "Admin");
        request.Headers.Add(TestAuthHandler.IdentityHeader, TestAuthHandler.AdminIdentity);

        var response = await _client.SendAsync(request);
        var dreams = await response.Content.ReadFromJsonAsync<List<DreamDTO>>();

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        dreams.Should().NotBeNull();
        dreams!.Should().Contain(d => d.Id == 8);
    }

    [Fact]
    public async Task GetAll_AsNonAdmin_ExcludesAnotherUsersPrivateDream()
    {
        // The default test identity is Lucy (UserProfile Id 2); dream 5 is the admin's
        // private dream and must not appear in her listing.
        var response = await _client.GetAsync("/api/Dream");
        var dreams = await response.Content.ReadFromJsonAsync<List<DreamDTO>>();

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        dreams.Should().NotBeNull();
        dreams!.Should().NotContain(d => d.Id == 5);
        dreams.Should().Contain(d => d.Id == 8);
    }
}
