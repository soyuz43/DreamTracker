using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DreamTrackerAPI.Data;
using DreamTrackerAPI.Models;
using DreamTrackerAPI.Models.DTOs;
using System.Security.Claims;

namespace DreamTrackerAPI.Controllers;

#if !DEBUG
[Authorize]
#endif
[ApiController]
[Route("api/[controller]")]
public class FavoriteController : ControllerBase
{
    private readonly DreamTrackerDbContext _context;

    public FavoriteController(DreamTrackerDbContext context)
    {
        _context = context;
    }

    // GET: api/Favorite
    [HttpGet("mine")]
    public async Task<ActionResult<List<FavoriteDto>>> GetMyFavorites()
    {
        int userProfileId = await GetUserProfileId();

        var favorites = await _context.Favorites
            .AsNoTracking()
            .Where(f => f.UserProfileId == userProfileId)
            .Include(f => f.Dream)
                .ThenInclude(d => d.Category)
            .Include(f => f.Dream)
                .ThenInclude(d => d.UserProfile)
            .Include(f => f.Dream)
                .ThenInclude(d => d.DreamTags)
                    .ThenInclude(dt => dt.Tag)
            .Select(f => new FavoriteDto
            {
                DreamId = f.DreamId,
                FavoritedOn = f.FavoritedOn,
                Dream = new DreamDTO
                {
                    Id = f.Dream.Id,
                    Title = f.Dream.Title,
                    Content = f.Dream.Content,
                    IsPublic = f.Dream.IsPublic,
                    CreatedOn = f.Dream.CreatedOn,
                    PublishedBy = f.Dream.UserProfile != null ? f.Dream.UserProfile.FirstName : "Anonymous",
                    UserProfileId = f.Dream.UserProfileId,
                    Category = new CategoryDTO
                    {
                        Id = f.Dream.Category.Id,
                        Name = f.Dream.Category.Name
                    },
                    Tags = f.Dream.DreamTags.Select(dt => new TagDTO
                    {
                        Id = dt.Tag.Id,
                        Name = dt.Tag.Name
                    }).ToList()
                }
            })
            .ToListAsync();

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

        Console.WriteLine("Available claims:");
        foreach (var c in User.Claims)
        {
            Console.WriteLine($" - {c.Type} : {c.Value}");
        }

        if (claim == null)
        {
#if DEBUG
            Console.WriteLine("WARNING: No JWT found in request. Using mock IdentityUserId for development.");
            return "mock-user-id-lucy"; // Replace with real IdentityUserId string from DB for testing
#else
            throw new UnauthorizedAccessException("User is not authenticated.");
#endif
        }

        return claim.Value;
    }
}
