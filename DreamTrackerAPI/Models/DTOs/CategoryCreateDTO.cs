using System.ComponentModel.DataAnnotations;

namespace DreamTrackerAPI.Models.DTOs;

public class CategoryCreateDTO
{
    [Required]
    public string Name { get; set; } = string.Empty;
}
