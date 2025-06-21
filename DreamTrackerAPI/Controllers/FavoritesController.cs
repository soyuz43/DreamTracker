using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DreamTrackerAPI.Data;
using DreamTrackerAPI.Models;
using DreamTrackerAPI.Models.DTOs;
using System.Security.Claims;

namespace DreamTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize]
public class FavoriteController : ControllerBase
{
    private readonly DreamTrackerDbContext _context;

    public FavoriteController(DreamTrackerDbContext context)
    {
        _context = context;
    }

    // GET: api/Favorite
    // [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<FavoriteDto>>> GetMyFavorites()
    {
        int userProfileId = await GetUserProfileId();
        
        // Debug: Log what we're looking for
        Console.WriteLine($"Looking for favorites for UserProfileId: {userProfileId}");
        
        // Debug: Check all favorites in database
        var allFavorites = await _context.Favorites.ToListAsync();
        Console.WriteLine($"Total favorites in database: {allFavorites.Count}");
        foreach (var fav in allFavorites)
        {
            Console.WriteLine($"Favorite: UserProfileId={fav.UserProfileId}, DreamId={fav.DreamId}");
        }
        
        var favorites = await _context.Favorites
            .AsNoTracking()
            .Where(f => f.UserProfileId == userProfileId)
            .Select(f => new FavoriteDto
            {
                DreamId = f.DreamId,
                FavoritedOn = f.FavoritedOn
            })
            .ToListAsync();

        Console.WriteLine($"Filtered favorites count: {favorites.Count}");
        return Ok(favorites);
    }

    // GET: api/Favorite/status/6
    [HttpGet("status/{dreamId:int}")]
    public async Task<ActionResult<FavoriteStatusDto>> GetStatus(int dreamId)
    {
        int userProfileId = await GetUserProfileId();
        bool isFavorited = await _context.Favorites
            .AnyAsync(f => f.UserProfileId == userProfileId && f.DreamId == dreamId);

        return Ok(new FavoriteStatusDto
        {
            DreamId = dreamId,
            IsFavorited = isFavorited
        });
    }

    // POST: api/Favorite
    [HttpPost]
    public async Task<ActionResult<FavoriteDto>> Create(FavoriteCreateDto dto)
    {
        int userProfileId = await GetUserProfileId();

        if (await _context.Favorites.AnyAsync(f => f.UserProfileId == userProfileId && f.DreamId == dto.DreamId))
        {
            return Conflict("Already favorited.");
        }

        var favorite = new Favorite
        {
            UserProfileId = userProfileId,
            DreamId = dto.DreamId,
            FavoritedOn = DateTime.UtcNow
        };

        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetStatus), new { dreamId = dto.DreamId }, new FavoriteDto
        {
            DreamId = favorite.DreamId,
            FavoritedOn = favorite.FavoritedOn
        });
    }

    // DELETE: api/Favorite/6
    [HttpDelete("{dreamId:int}")]
    public async Task<ActionResult<FavoriteDto>> Delete(int dreamId)
    {
        int userProfileId = await GetUserProfileId();
        var favorite = await _context.Favorites
            .SingleOrDefaultAsync(f => f.UserProfileId == userProfileId && f.DreamId == dreamId);

        if (favorite == null) return NotFound();

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();

        return Ok(new FavoriteDto
        {
            DreamId = dreamId,
            FavoritedOn = favorite.FavoritedOn
        });
    }

    private async Task<int> GetUserProfileId()
    {
        var identityUserId = GetIdentityUserId();
        
        Console.WriteLine($"Identity User ID from claims: {identityUserId}");
        
        // Debug: Check all user profiles
        var allProfiles = await _context.UserProfiles.ToListAsync();
        Console.WriteLine($"Total user profiles: {allProfiles.Count}");
        foreach (var profile in allProfiles)
        {
            Console.WriteLine($"UserProfile: Id={profile.Id}, IdentityUserId={profile.IdentityUserId}, Name={profile.FirstName}");
        }
        
        var userProfile = await _context.UserProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(up => up.IdentityUserId == identityUserId);

        if (userProfile == null)
        {
            Console.WriteLine("No matching user profile found!");
            throw new UnauthorizedAccessException("User profile not found.");
        }

        Console.WriteLine($"Found UserProfile.Id: {userProfile.Id}");
        return userProfile.Id;
    }

    private string GetIdentityUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (claim == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        return claim.Value;
    }
}