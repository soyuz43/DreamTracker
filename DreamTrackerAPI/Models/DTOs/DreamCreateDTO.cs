namespace DreamTrackerAPI.Models.DTOs;

using System.ComponentModel.DataAnnotations;

public class DreamCreateDTO
{
    [Required]
    public int CategoryId { get; set; }

    [Required]
    [MaxLength(100)]
    public string? Title { get; set; }

    [Required]
    public string? Content { get; set; }

    public bool IsPublic { get; set; }

    public List<int> TagIds { get; set; } = new List<int>();
}
