using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using DreamTrackerAPI.Data;
using DreamTrackerAPI.Models;
using DreamTrackerAPI.Models.DTOs;

namespace DreamTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DreamController : ControllerBase
{
    private readonly DreamTrackerDbContext _context;

    public DreamController(DreamTrackerDbContext context)
    {
        _context = context;
    }

    // Public: Get all dreams
    [HttpGet]
    public async Task<ActionResult<List<DreamDTO>>> GetAll()
    {
        List<Dream> dreams = await _context.Dreams
            .Include(d => d.Category)
            .Include(d => d.DreamTags!).ThenInclude(dt => dt.Tag)
            .OrderByDescending(d => d.CreatedOn)
            .ToListAsync();

        List<DreamDTO> dtos = dreams
            .Select(d => new DreamDTO
            {
                Id = d.Id,
                Title = d.Title,
                Content = d.Content,
                IsPublic = d.IsPublic,
                CreatedOn = d.CreatedOn,
                Category = d.Category!,
                Tags = d.DreamTags!.Select(dt => dt.Tag!).ToList()
            })
            .ToList();

        return Ok(dtos);
    }

    // Public: Get a single dream
    [HttpGet("{id:int}")]
    public async Task<ActionResult<DreamDTO>> GetById(int id)
    {
        Dream? d = await _context.Dreams
            .Include(d => d.Category)
            .Include(d => d.DreamTags!).ThenInclude(dt => dt.Tag)
            .SingleOrDefaultAsync(d => d.Id == id);

        if (d == null)
        {
            return NotFound();
        }

        DreamDTO dto = new DreamDTO
        {
            Id = d.Id,
            Title = d.Title,
            Content = d.Content,
            IsPublic = d.IsPublic,
            CreatedOn = d.CreatedOn,
            Category = d.Category!,
            Tags = d.DreamTags!.Select(dt => dt.Tag!).ToList()
        };

        return Ok(dto);
    }

// Protected: Create a new dream
[Authorize]
[HttpPost]
public async Task<ActionResult<DreamDTO>> Create(DreamCreateDTO createDto)
{
    bool categoryExists = await _context.Categories.AnyAsync(c => c.Id == createDto.CategoryId);
    if (!categoryExists)
    {
        return BadRequest("Invalid category ID.");
    }

    string? identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (identityUserId == null)
    {
        return Unauthorized("Invalid user.");
    }

    UserProfile? profile = await _context.UserProfiles
        .FirstOrDefaultAsync(up => up.IdentityUserId == identityUserId);

    if (profile == null)
    {
        return Unauthorized("User profile not found.");
    }

    Dream dream = new Dream
    {
        CategoryId = createDto.CategoryId,
        UserProfileId = profile.Id,
        Title = createDto.Title!,
        Content = createDto.Content!,
        IsPublic = createDto.IsPublic,
        CreatedOn = DateTime.UtcNow
    };

    _context.Dreams.Add(dream);
    await _context.SaveChangesAsync();

    if (createDto.TagIds?.Any() == true)
    {
        IEnumerable<DreamTag> dreamTags = createDto.TagIds
            .Distinct()
            .Select(tagId => new DreamTag { DreamId = dream.Id, TagId = tagId });
        _context.DreamTags.AddRange(dreamTags);
        await _context.SaveChangesAsync();
    }

    await _context.Entry(dream).Reference(d => d.Category).LoadAsync();
    await _context.Entry(dream).Collection(d => d.DreamTags!).Query()
        .Include(dt => dt.Tag).LoadAsync();

    DreamDTO dto = new DreamDTO
    {
        Id = dream.Id,
        Title = dream.Title!,
        Content = dream.Content!,
        IsPublic = dream.IsPublic,
        CreatedOn = dream.CreatedOn,
        Category = dream.Category!,
        Tags = dream.DreamTags!.Select(dt => dt.Tag!).ToList()
    };

    return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
}

    // Protected: Update an existing dream
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, DreamCreateDTO updateDto)
    {
        Dream? dream = await _context.Dreams
            .Include(d => d.DreamTags!)
            .SingleOrDefaultAsync(d => d.Id == id);

        if (dream == null)
        {
            return NotFound();
        }

        dream.Title = updateDto.Title!;
        dream.Content = updateDto.Content!;
        dream.IsPublic = updateDto.IsPublic;
        dream.CategoryId = updateDto.CategoryId;

        _context.DreamTags.RemoveRange(dream.DreamTags!);
        IEnumerable<DreamTag>? newTags = updateDto.TagIds?
            .Distinct()
            .Select(tagId => new DreamTag { DreamId = dream.Id, TagId = tagId });
        if (newTags != null)
        {
            _context.DreamTags.AddRange(newTags);
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Protected: Delete a dream
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        Dream? dream = await _context.Dreams.FindAsync(id);
        if (dream == null)
        {
            return NotFound();
        }

        _context.Dreams.Remove(dream);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
