// Celebrity Birthday Challenge - Daily Celebrity Database
// Each entry includes the celebrity name, birthday date, and progressive clues

const celebrityBirthdays = [
    {
        "name": "Tom Hanks",
        "date": "07-09", // July 9th (real birthday)
        "clues": [
            "This actor is known for playing characters who find themselves in extraordinary situations.",
            "He won back-to-back Academy Awards for Best Actor in the 1990s.",
            "He starred in a movie about a man with a low IQ who witnesses historical events.",
            "He famously said 'Life is like a box of chocolates' in one of his most famous roles.",
            "He played the voice of Woody in the Toy Story franchise."
        ]
    },
    {
        "name": "Margot Robbie",
        "date": "07-02", // July 2nd (real birthday)
        "clues": [
            "This Australian actress gained fame playing a complex anti-hero character.",
            "She's known for her transformative performances and producing skills.",
            "She played a figure skater in a biographical dark comedy film.",
            "She starred as Harley Quinn in DC Comics movies.",
            "She was nominated for an Oscar for playing Tonya Harding."
        ]
    },
    {
        "name": "Sylvester Stallone",
        "date": "07-06", // July 6th (real birthday)
        "clues": [
            "This actor is known for playing iconic action heroes and underdog characters.",
            "He wrote and starred in a film about a boxer from Philadelphia.",
            "He's famous for playing a Vietnam veteran who becomes a police officer.",
            "He created the Rocky and Rambo franchises.",
            "He starred in 'Rocky', 'Rambo', and 'The Expendables' series."
        ]
    },
    {
        "name": "Tom Cruise",
        "date": "07-03", // July 3rd (real birthday)
        "clues": [
            "This actor is known for doing his own dangerous stunts in action films.",
            "He's famous for playing a fighter pilot in a classic 1980s film.",
            "He stars in a long-running spy franchise as a secret agent.",
            "He's known for running in many of his movies.",
            "He plays Ethan Hunt in the Mission: Impossible series."
        ]
    },
    {
        "name": "Harrison Ford",
        "date": "07-13", // July 13th (real birthday)
        "clues": [
            "This actor is known for playing iconic characters in some of cinema's biggest franchises.",
            "He played a space smuggler in a galaxy far, far away.",
            "He starred as an archaeologist who searches for ancient artifacts.",
            "He's famous for playing Han Solo and Indiana Jones.",
            "He appeared in 'Star Wars', 'Indiana Jones', and 'Blade Runner'."
        ]
    },
    {
        "name": "Danny Glover",
        "date": "07-22", // July 22nd (real birthday)
        "clues": [
            "This actor is known for his roles in action films and social dramas.",
            "He starred alongside Mel Gibson in a popular buddy cop franchise.",
            "He's famous for saying 'I'm getting too old for this' in his films.",
            "He played Roger Murtaugh in the Lethal Weapon series.",
            "He's known for his activism and humanitarian work."
        ]
    },
    {
        "name": "Sandra Bullock",
        "date": "07-26", // July 26th (real birthday)
        "clues": [
            "This actress is known for her roles in romantic comedies and thrillers.",
            "She won an Oscar for playing a mother in a sports drama.",
            "She starred in a film about a woman who drives a bus to prevent a bomb from exploding.",
            "She's famous for her roles in 'Speed' and 'The Blind Side'.",
            "She played Leigh Anne Tuohy in the film that won her an Academy Award."
        ]
    },
    {
        "name": "Arnold Schwarzenegger",
        "date": "07-30", // July 30th (real birthday)
        "clues": [
            "This actor and former bodybuilder became a Hollywood action star.",
            "He's famous for saying 'I'll be back' in his most iconic role.",
            "He played a cyborg assassin from the future.",
            "He starred in 'The Terminator', 'Predator', and 'Total Recall'.",
            "He was also the governor of California from 2003 to 2011."
        ]
    },
    {
        "name": "Jennifer Lawrence",
        "date": "08-15", // August 15th (real birthday)
        "clues": [
            "This actress became a household name in the 2010s with a popular dystopian film series.",
            "She won an Academy Award for Best Actress for a David O. Russell film.",
            "She played a character named Katniss in a trilogy of films.",
            "She starred in 'Silver Linings Playbook' and 'American Hustle'.",
            "She was the face of 'The Hunger Games' franchise."
        ]
    },
    {
        "name": "Leonardo DiCaprio",
        "date": "11-11", // November 11th (real birthday)
        "clues": [
            "This actor is known for his environmental activism and his work with Martin Scorsese.",
            "He finally won his first Oscar after several nominations for a survival thriller.",
            "He starred in 'Titanic', one of the highest-grossing films of all time.",
            "He played Jordan Belfort in 'The Wolf of Wall Street'.",
            "He won his Oscar for 'The Revenant' where he was attacked by a bear."
        ]
    },
    {
        "name": "Taylor Swift",
        "date": "12-13", // December 13th (real birthday)
        "clues": [
            "This artist is known for writing songs about her personal relationships.",
            "She started as a country singer before transitioning to pop music.",
            "She has won multiple Grammy Awards and is known for her storytelling lyrics.",
            "She has albums named after numbers and seasons.",
            "She's known for songs like 'Shake It Off' and 'Anti-Hero'."
        ]
    },
    {
        "name": "Dwayne Johnson",
        "date": "05-02", // May 2nd (real birthday)
        "clues": [
            "This person was a professional wrestler before becoming one of Hollywood's biggest stars.",
            "He's known for his catchphrase 'Can you smell what [he's] cooking?'",
            "He starred in the Fast & Furious franchise and Jumanji reboots.",
            "He's often called by a nickname related to geology.",
            "He was known as 'The Rock' in WWE."
        ]
    },
    {
        "name": "Oprah Winfrey",
        "date": "01-29", // January 29th (real birthday)
        "clues": [
            "This media mogul hosted one of the most successful talk shows in television history.",
            "She's known for her book club and philanthropic efforts.",
            "She famously gave away cars to her entire studio audience.",
            "She was born in rural Mississippi and overcame poverty to become a billionaire.",
            "Her talk show ran for 25 years and she's known for the phrase 'You get a car!'"
        ]
    },
    {
        "name": "Will Smith",
        "date": "09-25", // September 25th (real birthday)
        "clues": [
            "This actor started his career as a rapper in the late 1980s.",
            "He starred in a popular TV sitcom about a street-smart teenager.",
            "He's known for action movies and was once considered the king of July 4th blockbusters.",
            "He starred in 'Men in Black', 'Independence Day', and 'Ali'.",
            "He played the Fresh Prince in a show about moving to Bel-Air."
        ]
    },
    {
        "name": "Emma Stone",
        "date": "11-06", // November 6th (real birthday)
        "clues": [
            "This actress is known for her distinctive raspy voice and red hair.",
            "She won an Academy Award for a musical film set in Los Angeles.",
            "She starred in 'Superbad' and 'Easy A' early in her career.",
            "She played Mia in a movie with Ryan Gosling about jazz and dreams.",
            "She won her Oscar for 'La La Land'."
        ]
    },
    {
        "name": "Ryan Reynolds",
        "date": "10-23", // October 23rd (real birthday)
        "clues": [
            "This Canadian actor is known for his quick wit and sarcastic humor.",
            "He's married to a popular actress and they're known for their playful social media banter.",
            "He played Deadpool, a wise-cracking anti-hero in red spandex."
        ]
    },
    {
        "name": "Scarlett Johansson",
        "date": "11-22", // November 22nd (real birthday)
        "clues": [
            "This actress is known for playing a Marvel superhero with red hair.",
            "She's been nominated for multiple Academy Awards for both acting and producing.",
            "She starred in 'Lost in Translation' and 'Marriage Story'.",
            "She played Black Widow in the Marvel Cinematic Universe.",
            "She's known for her distinctive husky voice and has done voice work in animated films."
        ]
    },
    {
        "name": "Chris Hemsworth",
        "date": "08-11", // August 11th (real birthday)
        "clues": [
            "This Australian actor is known for playing a Norse god in superhero movies.",
            "He's one of the tallest actors in the Marvel Cinematic Universe.",
            "He wields a magical hammer called Mjolnir in his most famous role.",
            "He starred in 'Rush' and 'In the Heart of the Sea' outside of superhero films.",
            "He plays Thor, the God of Thunder."
        ]
    },
    {
        "name": "Margot Robbie",
        "date": "2024-07-02",
        "clues": [
            "This Australian actress gained fame playing a complex anti-hero character.",
            "She's known for her transformative performances and producing skills.",
            "She played a figure skater in a biographical dark comedy film.",
            "She starred as Harley Quinn in DC Comics movies.",
            "She was nominated for an Oscar for playing Tonya Harding."
        ]
    },
    {
        "name": "Robert Downey Jr",
        "date": "2024-04-04",
        "clues": [
            "This actor had a career comeback that made him one of Hollywood's highest-paid stars.",
            "He's known for playing a genius billionaire philanthropist.",
            "He launched the Marvel Cinematic Universe with his iconic role.",
            "He wore a high-tech suit of armor in his most famous character.",
            "He played Tony Stark/Iron Man for over a decade."
        ]
    },
    {
        "name": "Zendaya",
        "date": "2024-09-01",
        "clues": [
            "This young actress started on Disney Channel before becoming a major movie star.",
            "She's known for her fashion sense and activism.",
            "She starred in a recent Spider-Man trilogy as the love interest.",
            "She won an Emmy for her role in a HBO drama series about teenagers.",
            "She played MJ in the Tom Holland Spider-Man films and Rue in 'Euphoria'."
        ]
    },
    {
        "name": "Brad Pitt",
        "date": "2024-12-18",
        "clues": [
            "This actor has been a Hollywood heartthrob for over three decades.",
            "He won an Oscar for Best Supporting Actor for playing a stuntman.",
            "He starred in 'Fight Club', 'Ocean's Eleven', and 'Se7en'.",
            "He was married to Jennifer Aniston and later Angelina Jolie.",
            "He won his Oscar for 'Once Upon a Time in Hollywood'."
        ]
    },
    {
        "name": "Angelina Jolie",
        "date": "2024-06-04",
        "clues": [
            "This actress is also known for her humanitarian work with the UN.",
            "She won an Oscar for playing a mental patient in the 1990s.",
            "She starred in action films like 'Salt' and 'Wanted'.",
            "She played Lara Croft in the Tomb Raider films.",
            "She won her Oscar for 'Girl, Interrupted'."
        ]
    },
    {
        "name": "Chris Evans",
        "date": "2024-06-13",
        "clues": [
            "This actor is known for playing America's first superhero.",
            "He's from Boston and is a big fan of the New England Patriots.",
            "He carried a shield as his primary weapon in his most famous role.",
            "He starred in 'Snowpiercer' and 'Knives Out' outside of superhero films.",
            "He played Steve Rogers/Captain America in the Marvel films."
        ]
    },
    {
        "name": "Jennifer Aniston",
        "date": "2024-02-11",
        "clues": [
            "This actress became famous playing a character known for her hairstyle.",
            "She starred in one of the most popular sitcoms of the 1990s.",
            "She's known for romantic comedies and has her own production company.",
            "She played Rachel Green on a show about six friends in New York.",
            "She starred in 'Friends' for 10 seasons."
        ]
    },
    {
        "name": "Ryan Gosling",
        "date": "2024-11-12",
        "clues": [
            "This Canadian actor is known for his intense, brooding performances.",
            "He starred in a romantic drama that became a cultural phenomenon.",
            "He played a jazz pianist in a musical film with Emma Stone.",
            "He starred in 'Blade Runner 2049' and 'First Man'.",
            "He's famous for the line 'Hey girl' memes and starred in 'The Notebook'."
        ]
    },
    {
        "name": "Gal Gadot",
        "date": "2024-04-30",
        "clues": [
            "This Israeli actress served in the military before becoming a Hollywood star.",
            "She's known for playing an Amazonian warrior princess.",
            "She starred in the Fast & Furious franchise before her superhero role.",
            "She carries a lasso of truth and has an invisible jet.",
            "She plays Wonder Woman in DC Comics films."
        ]
    },
    {
        "name": "Michael B Jordan",
        "date": "2024-02-09",
        "clues": [
            "This actor is known for his collaborations with director Ryan Coogler.",
            "He played a boxer in a Rocky spin-off franchise.",
            "He starred in a groundbreaking Marvel film set in Africa.",
            "He played the villain Killmonger in a superhero movie.",
            "He starred in 'Creed' and 'Black Panther'."
        ]
    },
    {
        "name": "Emma Watson",
        "date": "2024-04-15",
        "clues": [
            "This British actress grew up on screen in a beloved fantasy film series.",
            "She's known for her activism, particularly for women's rights.",
            "She played the smartest witch of her age in a magical world.",
            "She starred alongside Daniel Radcliffe and Rupert Grint.",
            "She played Hermione Granger in the Harry Potter films."
        ]
    },
    {
        "name": "Tom Holland",
        "date": "2024-06-01",
        "clues": [
            "This young British actor is known for doing his own stunts.",
            "He started as a dancer and gymnast before becoming an actor.",
            "He's the youngest actor to play a certain web-slinging superhero.",
            "He starred in 'The Impossible' and 'Cherry'.",
            "He plays the current Spider-Man in the Marvel Cinematic Universe."
        ]
    },
    {
        "name": "Keanu Reeves",
        "date": "2024-09-02",
        "clues": [
            "This actor is known for his kindness and humility in Hollywood.",
            "He starred in a groundbreaking sci-fi film about reality and illusion.",
            "He's known for action franchises involving assassins and motorcycles.",
            "He played Neo in a film about taking red or blue pills.",
            "He stars in 'The Matrix' and 'John Wick' franchises."
        ]
    },
    {
        "name": "Priyanka Chopra",
        "date": "2024-07-18",
        "clues": [
            "This actress was Miss World before becoming a Bollywood and Hollywood star.",
            "She starred in a popular TV series about FBI agents.",
            "She's married to a member of a famous pop band.",
            "She played Alex Parrish in 'Quantico'.",
            "She's married to Nick Jonas and has appeared in 'The Matrix Resurrections'."
        ]
    },
    {
        "name": "Timothée Chalamet",
        "date": "2024-12-27",
        "clues": [
            "This young actor is known for his indie film roles and unique fashion sense.",
            "He was nominated for an Oscar for his first major film role.",
            "He starred in a coming-of-age romance set in Italy.",
            "He played Paul Atreides in a recent sci-fi epic.",
            "He starred in 'Call Me by Your Name' and 'Dune'."
        ]
    },
    {
        "name": "Anya Taylor-Joy",
        "date": "04-16", // April 16th (real birthday)
        "clues": [
            "This actress gained fame playing a chess prodigy in a Netflix series.",
            "She's known for her distinctive wide-set eyes and ethereal beauty.",
            "She starred in horror films before her breakthrough TV role.",
            "She played Beth Harmon in a series about chess.",
            "She starred in 'The Queen's Gambit' and 'The Menu'."
        ]
    },
    {
        "name": "Robert Downey Jr",
        "date": "04-04", // April 4th (real birthday)
        "clues": [
            "This actor had a career comeback that made him one of Hollywood's highest-paid stars.",
            "He's known for playing a genius billionaire philanthropist.",
            "He launched the Marvel Cinematic Universe with his iconic role.",
            "He wore a high-tech suit of armor in his most famous character.",
            "He played Tony Stark/Iron Man for over a decade."
        ]
    },
    {
        "name": "Ryan Gosling",
        "date": "11-12", // November 12th (real birthday)
        "clues": [
            "This Canadian actor is known for his intense, brooding performances.",
            "He starred in a romantic drama that became a cultural phenomenon.",
            "He played a jazz pianist in a musical film with Emma Stone.",
            "He starred in 'Blade Runner 2049' and 'First Man'.",
            "He's famous for the line 'Hey girl' memes and starred in 'The Notebook'."
        ]
    },
    {
        "name": "Brad Pitt",
        "date": "12-18", // December 18th (real birthday)
        "clues": [
            "This actor has been a Hollywood heartthrob for over three decades.",
            "He won an Oscar for Best Supporting Actor for playing a stuntman.",
            "He starred in 'Fight Club', 'Ocean's Eleven', and 'Se7en'.",
            "He was married to Jennifer Aniston and later Angelina Jolie.",
            "He won his Oscar for 'Once Upon a Time in Hollywood'."
        ]
    }
];

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = celebrityBirthdays;
}
