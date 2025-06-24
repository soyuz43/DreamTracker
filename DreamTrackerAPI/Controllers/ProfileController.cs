using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using DreamTrackerAPI.Data;
using DreamTrackerAPI.Models;
using DreamTrackerAPI.Models.DTOs;
using Microsoft.AspNetCore.Identity;

namespace DreamTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly DreamTrackerDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public ProfileController(DreamTrackerDbContext context, UserManager<IdentityUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET api/profile
    [HttpGet]
    public async Task<ActionResult<UserProfileDTO>> GetMine()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = await _context.UserProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.IdentityUserId == userId);
        if (profile == null) return NotFound();

        var identity = await _userManager.FindByIdAsync(userId);
        var roles = await _userManager.GetRolesAsync(identity);

        return Ok(new UserProfileDTO
        {
            Id = profile.Id,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            Address = profile.Address,
            Email = identity.Email,
            UserName = identity.UserName,
            IdentityUserId = userId,
            Roles = roles.ToList()
        });
    }

    // PUT api/profile
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UserProfileUpdateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = await _context.UserProfiles
            .FirstOrDefaultAsync(p => p.IdentityUserId == userId);

        if (profile == null) return NotFound();

        profile.FirstName = dto.FirstName;
        profile.LastName = dto.LastName;
        profile.Address = dto.Address;

        await _context.SaveChangesAsync();
        return NoContent();
    }


    // DELETE api/profile
    [HttpDelete]
    public async Task<IActionResult> Delete()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.IdentityUserId == userId);
        if (profile == null) return NotFound();

        // delete IdentityUser as well
        var identity = await _userManager.FindByIdAsync(userId);
        if (identity != null)
        {
            await _userManager.DeleteAsync(identity);
        }

        // This will cascade-d elete profile if configured, else:
        _context.UserProfiles.Remove(profile);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
