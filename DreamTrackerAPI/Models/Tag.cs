using System.ComponentModel.DataAnnotations;

namespace DreamTrackerAPI.Models;

public class Tag
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(50)]
    public string? Name { get; set; }

    public ICollection<DreamTag>? DreamTags { get; set; }
}
