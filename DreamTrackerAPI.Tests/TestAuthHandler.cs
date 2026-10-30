// TestAuthHandler.cs
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace DreamTrackerAPI.Tests;

/// <summary>
/// Deterministic authentication for integration tests. The identity and role can be
/// overridden per-request via the X-Test-Identity / X-Test-Roles headers so that both
/// owner and non-admin scenarios can be exercised.
/// </summary>
public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string Scheme = "TestAuth";
    public const string IdentityHeader = "X-Test-Identity";
    public const string RolesHeader = "X-Test-Roles";
    public const string AnonymousHeader = "X-Test-Anonymous";

    /// <summary>Seeded Lucy's IdentityUserId (UserProfile Id 2).</summary>
    public const string DefaultIdentity = "b2f0a5a7-55f6-4b6e-a12f-89ef34d9ec3c";

    /// <summary>Seeded Admina's IdentityUserId (UserProfile Id 1).</summary>
    public const string AdminIdentity = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f";

    public TestAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder) : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Allow a test to exercise the unauthenticated path.
        if (Request.Headers.ContainsKey(AnonymousHeader))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        string identity = Request.Headers.TryGetValue(IdentityHeader, out var id)
            ? id.ToString()
            : DefaultIdentity;

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, identity),
            new(ClaimTypes.Name, "test-user")
        };

        if (Request.Headers.TryGetValue(RolesHeader, out var roles))
        {
            foreach (string role in roles.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries))
            {
                claims.Add(new Claim(ClaimTypes.Role, role.Trim()));
            }
        }

        var ticket = new AuthenticationTicket(
            new ClaimsPrincipal(new ClaimsIdentity(claims, Scheme)), Scheme);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
