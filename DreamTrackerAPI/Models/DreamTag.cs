using System.ComponentModel.DataAnnotations.Schema;

namespace DreamTrackerAPI.Models;

public class DreamTag
{
    [ForeignKey(nameof(Dream))]
    public int DreamId { get; set; }

    [ForeignKey(nameof(Tag))]
    public int TagId { get; set; }

    public Dream? Dream { get; set; }

    public Tag? Tag { get; set; }
}
