// DreamTrackerAPI/Models/Favorite.cs
using System.ComponentModel.DataAnnotations;

namespace DreamTrackerAPI.Models;

public class Favorite
{
    public int UserProfileId { get; set; }
    public UserProfile? UserProfile { get; set; }

    public int DreamId { get; set; }
    public Dream? Dream { get; set; }

    public DateTime FavoritedOn { get; set; } = DateTime.UtcNow;
}
