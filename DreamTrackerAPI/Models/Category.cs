using System.ComponentModel.DataAnnotations;

namespace DreamTrackerAPI.Models;

public class Category
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string? Name { get; set; }

    public ICollection<Dream>? Dreams { get; set; }
}
