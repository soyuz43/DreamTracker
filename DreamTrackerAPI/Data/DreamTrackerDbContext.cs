using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using DreamTrackerAPI.Models;

namespace DreamTrackerAPI.Data;

public class DreamTrackerDbContext : IdentityDbContext<IdentityUser>
{
    private readonly IConfiguration _configuration;

    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<Dream> Dreams { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<DreamTag> DreamTags { get; set; }
    public DbSet<Favorite> Favorites { get; set; }


    public DreamTrackerDbContext(DbContextOptions<DreamTrackerDbContext> context, IConfiguration config)
        : base(context)
    {
        _configuration = config;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ─── Identity seeds ─────────────────────────────────────────────────────────
        modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
        {
            Id = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
            Name = "Admin",
            NormalizedName = "ADMIN"
        });

        modelBuilder.Entity<IdentityUser>().HasData(
            new IdentityUser
            {
                Id = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                UserName = "Administrator",
                Email = "admina@strator.comx",
                NormalizedEmail = "ADMINA@STRATOR.COMX",
                NormalizedUserName = "ADMINISTRATOR",
                EmailConfirmed = true,
                PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(new IdentityUser(), _configuration["AdminPassword"] ?? "DefaultAdminPassword"),
                SecurityStamp = Guid.NewGuid().ToString()
            },
            new IdentityUser
            {
                Id = "b2f0a5a7-55f6-4b6e-a12f-89ef34d9ec3c",
                UserName = "lucy",
                Email = "lucy@dream.com",
                NormalizedEmail = "LUCY@DREAM.COM",
                NormalizedUserName = "LUCY",
                EmailConfirmed = true,
                PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(new IdentityUser(), _configuration["UserPassword"] ?? "DefaultUserPassword"),
                SecurityStamp = Guid.NewGuid().ToString()
            }
        );

        modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
        {
            RoleId = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
            UserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f"
        });

        modelBuilder.Entity<UserProfile>().HasData(
            new UserProfile
            {
                Id = 1,
                IdentityUserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                FirstName = "Admina",
                LastName = "Strator",
                Address = "101 Main Street"
            },
            new UserProfile
            {
                Id = 2,
                IdentityUserId = "b2f0a5a7-55f6-4b6e-a12f-89ef34d9ec3c",
                FirstName = "Lucy",
                LastName = "Dreamer",
                Address = "202 Sleep Lane"
            }
        );


        // ─── Categories ─────────────────────────────────────────────────────────────
        modelBuilder.Entity<Category>().HasData(new Category[]
        {
            new Category { Id = 1, Name = "Meta-dreams" },
            new Category { Id = 2, Name = "Nightmares" },
            new Category { Id = 3, Name = "Lucid Dreams" },
            new Category { Id = 4, Name = "Recurring Dreams" },
            new Category { Id = 5, Name = "Flying Dreams" },
            new Category { Id = 6, Name = "Chase Dreams" },
            new Category { Id = 7, Name = "Prophetic Dreams" },
            new Category { Id = 8, Name = "Surreal & Symbolic Dreams" }
        });

        // ─── Tags (emotional context) ─────────────────────────────────────────────
        modelBuilder.Entity<Tag>().HasData(new Tag[]
        {
            new Tag { Id = 1, Name = "Joy" },
            new Tag { Id = 2, Name = "Fear" },
            new Tag { Id = 3, Name = "Awe" },
            new Tag { Id = 4, Name = "Confusion" },
            new Tag { Id = 5, Name = "Anger" },
            new Tag { Id = 6, Name = "Love" },
            new Tag { Id = 7, Name = "Sadness" },
            new Tag { Id = 8, Name = "Anxiety" },
            new Tag { Id = 9, Name = "Wonder" },
            new Tag { Id = 10, Name = "Surreal"},
            new Tag { Id = 11, Name = "Absurdity"}
        });

        // ─── Dreams ────────────────────────────────────────────────────────────────
        modelBuilder.Entity<Dream>().HasData(new Dream[]
        {
        new Dream
        {
            Id = 1,
            UserProfileId = 1,
            CategoryId = 1,
            Title = "Dream within a dream",
            Content = "I was dreaming that I was dreaming. Layers upon layers.",
            IsPublic = true,
            ShowAuthor = false,
            CreatedOn = new DateTime(2024, 10, 1)
        },
        new Dream
        {
            Id = 2,
            UserProfileId = 1,
            CategoryId = 2,
            Title = "Falling endlessly",
            Content = "Just falling through darkness. Never landing.",
            IsPublic = false,
            ShowAuthor = false,
            CreatedOn = new DateTime(2024, 10, 2)
        },
        new Dream
        {
            Id = 3,
            UserProfileId = 1,
            CategoryId = 4,
            Title = "Back in high school again",
            Content = "Taking the same exam over and over.",
            IsPublic = false,
            ShowAuthor = false,
            CreatedOn = new DateTime(2024, 10, 3)
        },
        new Dream
        {
            Id = 4,
            UserProfileId = 1,
            CategoryId = 5,
            Title = "Soaring over cities",
            Content = "Flying without effort, seeing the skyline shift below.",
            IsPublic = true,
            ShowAuthor = true,
            CreatedOn = new DateTime(2024, 10, 4)
        },
        new Dream
        {
            Id = 5,
            UserProfileId = 1,
            CategoryId = 6,
            Title = "Being chased but never caught",
            Content = "The more I run, the slower I move. I wake up breathless.",
            IsPublic = false,
            ShowAuthor = false,
            CreatedOn = new DateTime(2024, 10, 5)
        },
        new Dream
        {
            Id = 6,
            UserProfileId = 1,
            CategoryId = 8,
            Title = "My mother was a fish",
            Content = "She swam silently through the kitchen tiles. I think I've been reading too much Faulkner.",
            IsPublic = true,
            ShowAuthor = false,
            CreatedOn = new DateTime(2024, 10, 6)
        },
        new Dream
        {
            Id = 7,
            UserProfileId = 2,
            CategoryId = 3, // Lucid Dreams
            Title = "Woke up inside the dream",
            Content = "I realized I was dreaming and took control. I flew over a desert.",
            IsPublic = true,
            ShowAuthor = true,
            CreatedOn = new DateTime(2024, 10, 7)
        },
        new Dream
        {
            Id = 8,
            UserProfileId = 2,
            CategoryId = 7,
            Title = "The clock with no hands",
            Content = "I saw a clock with no hands ticking louder and louder. Then silence.",
            IsPublic = false,
            ShowAuthor = false,
            CreatedOn = new DateTime(2024, 10, 8)
        },
        new Dream
        {
            Id = 9,
            UserProfileId = 2,
            CategoryId = 8, // Surreal & Symbolic Dreams
            Title = "Swimming through the ceiling",
            Content = "Water was everywhere, but only on the ceiling. I swam upward through air.",
            IsPublic = true,
            ShowAuthor = false,
            CreatedOn = new DateTime(2024, 10, 9)
        }
        });

        // ─── DreamTags (join table relations) ────────────────────────────────────
        modelBuilder.Entity<DreamTag>().HasData(new DreamTag[]
        {
            new DreamTag { DreamId = 1, TagId = 3 }, // Awe
            new DreamTag { DreamId = 1, TagId = 4 }, // Confusion
            new DreamTag { DreamId = 2, TagId = 2 }, // Fear
            new DreamTag { DreamId = 3, TagId = 7 }, // Sadness
            new DreamTag { DreamId = 3, TagId = 8 }, // Anxiety
            new DreamTag { DreamId = 4, TagId = 1 }, // Joy
            new DreamTag { DreamId = 4, TagId = 9 }, // Wonder
            new DreamTag { DreamId = 5, TagId = 2 }, // Fear
            new DreamTag { DreamId = 5, TagId = 5 },  // Anger
            new DreamTag { DreamId = 6, TagId = 4 }, // Confusion
            new DreamTag { DreamId = 6, TagId = 10 }, // Surreal
            new DreamTag { DreamId = 6, TagId = 11 }, // Absurdity
            new DreamTag { DreamId = 6, TagId = 7 }, // Sadness
            new DreamTag { DreamId = 7, TagId = 1 }, // Joy
            new DreamTag { DreamId = 7, TagId = 9 }, // Wonder
            new DreamTag { DreamId = 8, TagId = 4 }, // Confusion
            new DreamTag { DreamId = 8, TagId = 8 }, // Anxiety
            new DreamTag { DreamId = 9, TagId = 10 }, // Surreal
            new DreamTag { DreamId = 9, TagId = 11 }, // Absurdity
            new DreamTag { DreamId = 9, TagId = 6 }  // Love
        });

        modelBuilder.Entity<DreamTag>().HasKey(dt => new { dt.DreamId, dt.TagId });
        modelBuilder.Entity<DreamTag>()
            .HasOne(dt => dt.Dream)
            .WithMany(d => d.DreamTags)
            .HasForeignKey(dt => dt.DreamId);

        modelBuilder.Entity<DreamTag>()
            .HasOne(dt => dt.Tag)
            .WithMany(t => t.DreamTags)
            .HasForeignKey(dt => dt.TagId);

        modelBuilder.Entity<Favorite>().HasKey(f => new { f.UserProfileId, f.DreamId });

        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.UserProfile)
            .WithMany()
            .HasForeignKey(f => f.UserProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.Dream)
            .WithMany()
            .HasForeignKey(f => f.DreamId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Favorite>().HasData(new Favorite
        {
            UserProfileId = 2,
            DreamId = 6,
            FavoritedOn = new DateTime(2024, 10, 10)
        });
    }
}