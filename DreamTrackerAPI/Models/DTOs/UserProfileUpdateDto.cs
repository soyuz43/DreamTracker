// Models/DTOs/UserProfileUpdateDto.cs
namespace DreamTrackerAPI.Models.DTOs;
public class UserProfileUpdateDto
{
  public int Id { get; set; }
  public string? FirstName { get; set; }
  public string? LastName { get; set; }
  public string? Address { get; set; }
}
