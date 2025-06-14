using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DreamTrackerAPI.Models;

public class Dream
{
    [Key]
    public int Id { get; set; }

    [ForeignKey(nameof(UserProfile))]
    public int UserProfileId { get; set; }

    [ForeignKey(nameof(Category))]
    public int CategoryId { get; set; }

    [Required, MaxLength(200)]
    public string? Title { get; set; }

    [Required]
    public string? Content { get; set; }

    public bool IsPublic { get; set; }
    public bool ShowAuthor { get; set; } = false;
    
    public DateTime CreatedOn { get; set; }

    public UserProfile? UserProfile { get; set; }

    public Category? Category { get; set; }

    public ICollection<DreamTag>? DreamTags { get; set; }
}
