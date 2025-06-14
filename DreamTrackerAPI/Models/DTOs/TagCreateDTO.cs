using System.ComponentModel.DataAnnotations;

namespace DreamTrackerAPI.Models.DTOs;

public class TagCreateDTO
{
    [Required]
    public string Name { get; set; } = string.Empty;
}
