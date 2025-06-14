using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DreamTrackerAPI.Data;
using DreamTrackerAPI.Models;
using DreamTrackerAPI.Models.DTOs;

namespace DreamTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly DreamTrackerDbContext _context;

    public CategoryController(DreamTrackerDbContext context)
    {
        _context = context;
    }

    // GET: api/Category
    [HttpGet]
    public async Task<ActionResult<List<CategoryDTO>>> GetAll()
    {
        List<Category> categories = await _context.Categories
            .AsNoTracking()         // Improves performance by disabling change tracking for read-only query
            .OrderBy(c => c.Id) 
            .ToListAsync();

        List<CategoryDTO> dtos = categories
            .Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name!
            })
            .ToList();

        return Ok(dtos);
    }

    // GET: api/Category/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryDTO>> GetById(int id)
    {
        Category? category = await _context.Categories
            .AsNoTracking()
            .SingleOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            return NotFound();
        }

        CategoryDTO dto = new CategoryDTO
        {
            Id = category.Id,
            Name = category.Name!
        };

        return Ok(dto);
    }

    // POST: api/Category
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<CategoryDTO>> Create(CategoryCreateDTO createDto)
    {
        if (await _context.Categories.AnyAsync(c => c.Name == createDto.Name))
        {
            return Conflict("A category with this name already exists.");
        }

        Category category = new Category
        {
            Name = createDto.Name
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        CategoryDTO dto = new CategoryDTO
        {
            Id = category.Id,
            Name = category.Name
        };

        return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
    }

    // PUT: api/Category/5
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CategoryCreateDTO updateDto)
    {
        Category? category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return NotFound();
        }

        if (await _context.Categories.AnyAsync(c => c.Name == updateDto.Name && c.Id != id))
        {
            return Conflict("Another category with this name already exists.");
        }

        category.Name = updateDto.Name;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Category/5
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        Category? category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return NotFound();
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
