namespace DreamTrackerAPI.Models.DTOs;

public class DreamDTO
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public bool IsPublic { get; set; }
    public DateTime CreatedOn { get; set; }

    public Category? Category { get; set; }
    public List<Tag>? Tags { get; set; }
}
