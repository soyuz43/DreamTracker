using System;
using System.Collections.Generic;

namespace DreamTrackerAPI.Models.DTOs
{
    public class DreamDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public bool IsPublic { get; set; }
        public DateTime CreatedOn { get; set; }

        // Optional attribution; defaults to "Anonymous" unless ShowAuthor is true
        public string PublishedBy { get; set; } = null!;

        // Nested DTOs for related entities
        public CategoryDTO Category { get; set; } = null!;
        public List<TagDTO> Tags { get; set; } = new();
    }
}
