using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DreamTrackerAPI.Data;
using DreamTrackerAPI.Models;
using DreamTrackerAPI.Models.DTOs;

namespace DreamTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagController : ControllerBase
{
    private readonly DreamTrackerDbContext _context;

    public TagController(DreamTrackerDbContext context)
    {
        _context = context;
    }

    // GET: api/Tag
    [HttpGet]
    public async Task<ActionResult<List<TagDTO>>> GetAll()
    {
        List<TagDTO> dtos = await _context.Tags
            .AsNoTracking()
            .OrderBy(t => t.Id)
            .Select(t => new TagDTO
            {
                Id = t.Id,
                Name = t.Name!
            })
            .ToListAsync();

        return Ok(dtos);
    }

    // GET: api/Tag/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TagDTO>> GetById(int id)
    {
        Tag? tag = await _context.Tags
            .AsNoTracking()
            .SingleOrDefaultAsync(t => t.Id == id);

        if (tag == null) return NotFound();

        return Ok(new TagDTO
        {
            Id = tag.Id,
            Name = tag.Name!
        });
    }

    // POST: api/Tag
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<TagDTO>> Create(TagCreateDTO createDto)
    {
        if (await _context.Tags.AnyAsync(t => t.Name == createDto.Name))
        {
            return Conflict("A tag with this name already exists.");
        }

        Tag tag = new Tag { Name = createDto.Name };

        _context.Tags.Add(tag);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = tag.Id }, new TagDTO
        {
            Id = tag.Id,
            Name = tag.Name
        });
    }

    // PUT: api/Tag/5
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, TagCreateDTO updateDto)
    {
        Tag? tag = await _context.Tags.FindAsync(id);

        if (tag == null) return NotFound();

        if (await _context.Tags.AnyAsync(t => t.Name == updateDto.Name && t.Id != id))
        {
            return Conflict("Another tag with this name already exists.");
        }

        tag.Name = updateDto.Name;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Tag/5
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        Tag? tag = await _context.Tags.FindAsync(id);

        if (tag == null) return NotFound();

        _context.Tags.Remove(tag);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
