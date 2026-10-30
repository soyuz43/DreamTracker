using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DreamTrackerAPI.Data;
using DreamTrackerAPI.Models;
using DreamTrackerAPI.Models.DTOs;
using System.Security.Claims;

namespace DreamTrackerAPI.Controllers;

// Authorization is enforced unconditionally. A DEBUG-configured build must never expose
// these endpoints without authentication.
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FavoriteController : ControllerBase
{
    private readonly DreamTrackerDbContext _context;
    private readonly ILogger<FavoriteController> _logger;

    public FavoriteController(DreamTrackerDbContext context, ILogger<FavoriteController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/Favorite
    [HttpGet("mine")]
    public async Task<ActionResult<List<FavoriteDto>>> GetMyFavorites()
    {
        int? userProfileId = await GetUserProfileId();
        if (userProfileId == null)
        {
            return Unauthorized("User profile not found.");
        }

        var favorites = await _context.Favorites
            .AsNoTracking()
            .Where(f => f.UserProfileId == userProfileId.Value)
            // Never expose private dreams owned by another user, even if they were favorited.
            .Where(f => f.Dream!.IsPublic || f.Dream!.UserProfileId == userProfileId.Value)
            .Include(f => f.Dream)
                .ThenInclude(d => d!.Category!)
            .Include(f => f.Dream)
                .ThenInclude(d => d!.UserProfile)
            .Include(f => f.Dream)
                .ThenInclude(d => d!.DreamTags!)
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
                    PublishedBy = (f.Dream.ShowAuthor && f.Dream.UserProfile != null)
                        ? $"{f.Dream.UserProfile.LastName}, {f.Dream.UserProfile.FirstName}"
                        : "Anonymous",
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
        int? userProfileId = await GetUserProfileId();
        if (userProfileId == null)
        {
            return Unauthorized("User profile not found.");
        }

        bool isFavorited = await _context.Favorites
            .AnyAsync(f => f.UserProfileId == userProfileId.Value && f.DreamId == dreamId);

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
        int? userProfileId = await GetUserProfileId();
        if (userProfileId == null)
        {
            return Unauthorized("User profile not found.");
        }

        if (await _context.Favorites.AnyAsync(f => f.UserProfileId == userProfileId.Value && f.DreamId == dto.DreamId))
        {
            return Conflict("Already favorited.");
        }

        // The caller must be able to see the dream before they can favorite it.
        // Return NotFound() (not Forbid()) so private dreams' existence is not disclosed.
        Dream? targetDream = await _context.Dreams
            .AsNoTracking()
            .SingleOrDefaultAsync(d => d.Id == dto.DreamId);

        if (targetDream == null)
        {
            return NotFound();
        }

        bool isOwner = targetDream.UserProfileId == userProfileId.Value;
        if (!targetDream.IsPublic && !isOwner)
        {
            return NotFound();
        }

        var favorite = new Favorite
        {
            UserProfileId = userProfileId.Value,
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
        int? userProfileId = await GetUserProfileId();
        if (userProfileId == null)
        {
            return Unauthorized("User profile not found.");
        }

        var favorite = await _context.Favorites
            .SingleOrDefaultAsync(f => f.UserProfileId == userProfileId.Value && f.DreamId == dreamId);

        if (favorite == null) return NotFound();

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();

        return Ok(new FavoriteDto
        {
            DreamId = dreamId,
            FavoritedOn = favorite.FavoritedOn
        });
    }

    private async Task<int?> GetUserProfileId()
    {
        string? identityUserId = GetIdentityUserId();
        if (identityUserId == null)
        {
            return null;
        }

        // Targeted lookup: never load the full profile table.
        var userProfile = await _context.UserProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(up => up.IdentityUserId == identityUserId);

        if (userProfile == null)
        {
            _logger.LogWarning("No UserProfile matched the authenticated identity.");
            return null;
        }

        _logger.LogDebug("Resolved UserProfile {UserProfileId} for the current identity.", userProfile.Id);
        return userProfile.Id;
    }

    private string? GetIdentityUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (claim == null)
        {
            _logger.LogWarning("Request is missing a NameIdentifier claim.");
            return null;
        }

        return claim.Value;
    }
}
