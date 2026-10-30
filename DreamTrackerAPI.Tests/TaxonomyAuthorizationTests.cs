// TaxonomyAuthorizationTests.cs
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;

namespace DreamTrackerAPI.Tests;

public class TaxonomyAuthorizationTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public TaxonomyAuthorizationTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateCategory_AsNonAdmin_ReturnsForbidden()
    {
        var response = await _client.PostAsJsonAsync("/api/Category", new { name = "ProbeCat" });

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task DeleteCategory_AsNonAdmin_ReturnsForbidden()
    {
        var response = await _client.DeleteAsync("/api/Category/1");

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task CreateTag_AsNonAdmin_ReturnsForbidden()
    {
        var response = await _client.PostAsJsonAsync("/api/Tag", new { name = "ProbeTag" });

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task CreateCategory_AsAdmin_ReturnsCreated()
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/Category")
        {
            Content = JsonContent.Create(new { name = "AdminCat" })
        };
        request.Headers.Add(TestAuthHandler.RolesHeader, "Admin");
        request.Headers.Add(TestAuthHandler.IdentityHeader, TestAuthHandler.AdminIdentity);

        var response = await _client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task GetCategories_RemainsPubliclyReadable()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/Category");
        request.Headers.Add(TestAuthHandler.AnonymousHeader, "true");

        var response = await _client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
