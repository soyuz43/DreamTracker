using System.ComponentModel.DataAnnotations;

namespace DreamTrackerAPI.Models.DTOs;

public class CategoryDTO
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;
}
