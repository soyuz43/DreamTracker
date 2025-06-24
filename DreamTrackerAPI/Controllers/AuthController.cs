using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using DreamTrackerAPI.Models;
using DreamTrackerAPI.Models.DTOs;
using DreamTrackerAPI.Data;

namespace DreamTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private DreamTrackerDbContext _dbContext;
    private UserManager<IdentityUser> _userManager;

    public AuthController(DreamTrackerDbContext context, UserManager<IdentityUser> userManager)
    {
        _dbContext = context;
        _userManager = userManager;
    }

[HttpPost("login")]
public async Task<IActionResult> Login([FromHeader(Name = "Authorization")] string authHeader)
{
    if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Basic "))
        return Unauthorized("Missing or invalid Authorization header.");

    try
    {
        // Decode base64 string
        var encodedCreds = authHeader.Substring("Basic ".Length).Trim();
        var decodedBytes = Convert.FromBase64String(encodedCreds);
        var decodedString = Encoding.GetEncoding("iso-8859-1").GetString(decodedBytes);

        var separatorIndex = decodedString.IndexOf(':');
        if (separatorIndex < 0)
            return Unauthorized("Invalid credentials format.");

        var email = decodedString.Substring(0, separatorIndex);
        var password = decodedString.Substring(separatorIndex + 1);

        var user = _dbContext.Users.FirstOrDefault(u => u.Email == email);
        if (user == null)
            return Unauthorized("User not found.");

        var hasher = new PasswordHasher<IdentityUser>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, password);
        if (result != PasswordVerificationResult.Success)
            return Unauthorized("Incorrect password.");

        // Build claims
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email)
        };

        // Get roles
        var userRoles = _dbContext.UserRoles.Where(ur => ur.UserId == user.Id).ToList();
        foreach (var userRole in userRoles)
        {
            var role = _dbContext.Roles.FirstOrDefault(r => r.Id == userRole.RoleId);
            if (role != null)
                claims.Add(new Claim(ClaimTypes.Role, role.Name));
        }

        // Create identity and sign in
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

        return Ok(new { message = "Login successful" });
    }
    catch (FormatException)
    {
        return Unauthorized("Base64 decoding failed.");
    }
    catch (Exception ex)
    {
        // Log error (optional)
        return StatusCode(500, "Internal server error");
    }
}


    [HttpGet("logout")]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    public IActionResult Logout()
    {
        try
        {
            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme).Wait();
            return Ok();
        }
        catch
        {
            return StatusCode(500);
        }
    }

    [HttpGet("Me")]
    [Authorize]
    public IActionResult Me()
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        var roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

        if (profile != null)
        {
            var userDto = new UserProfileDTO
            {
                Id = profile.Id,
                FirstName = profile.FirstName,
                LastName = profile.LastName,
                Address = profile.Address,
                IdentityUserId = identityUserId,
                UserName = User.FindFirstValue(ClaimTypes.Name),
                Email = User.FindFirstValue(ClaimTypes.Email),
                Roles = roles
            };

            return Ok(userDto);
        }

        return NotFound();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegistrationDTO registration)
    {
        var user = new IdentityUser
        {
            UserName = registration.UserName,
            Email = registration.Email
        };

        var password = Encoding
            .GetEncoding("iso-8859-1")
            .GetString(Convert.FromBase64String(registration.Password));

        var result = await _userManager.CreateAsync(user, password);
        if (result.Succeeded)
        {
            _dbContext.UserProfiles.Add(new UserProfile
            {
                FirstName = registration.FirstName,
                LastName = registration.LastName,
                Address = registration.Address,
                IdentityUserId = user.Id
            });
            _dbContext.SaveChanges();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity)).Wait();

            return Ok();
        }

        return StatusCode(500);
    }
}
