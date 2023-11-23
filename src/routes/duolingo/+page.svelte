<svelte:head>
	<title>Max Allison — Duolingo</title>
</svelte:head>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 50px;
    }

    @media (min-width: 600px) {
        .container {
            flex-direction: row;  /* Side by side for wider screens */
            justify-content: space-between;
        }
    }

    .text-section, .image-section {
        flex: 1;
        padding: 20px;
    }

    img {
        max-width: 100%;
        height: auto;
    }


    a {
        color: #FFFFFF; /* Replace with your desired color */
        text-decoration: underline; /* Removes the underline from links */
    }

    a:hover {
        color: #F11111; /* Color when the mouse hovers over the link */
        text-decoration: none; /* Adds underline on hover for better UX */
    }
</style>

<main>
    <h1>Duolingo</h1>
    
    <!-- Project 1 -->
        <div class="text-section">
            <p>Although I have many strictly software-oriented projects to share, I thought this portfolio might be best suited to display some of my more language-learning-oriented accomplishments to show my absolute love for and dedication to sharing language with the world.</p>
        </div>
    <section class="container">
        <div class="text-section">
            <h2>Project 1: Chinese Character Art Exhibition</h2>
            <p> Every year, the Harvard Chinese department holds a creative contest and art exhibition where participants have a limited amount of time to make an art piece using chinese characters. My project, which uses the chinese character 星 (star), won the award for student choice. This project was created using javascript and a graphics library to make an explosion of stars.</p>
        </div>
    </section>
    <section class="container">
        <div class ="image-section">
            <img src="xing.png">
        </div>
    </section>
    <section class="container">
        <div class="text-section">
            <a href="https://maxballison.github.io/hanzi-project/">Here's the final site</a>
        </div>
    </section>

    <!-- Project 2 -->
    <section class="container">
        <div class="text-section">
            <h2>Project 2: Chinese Film Festival (Winner of Audience Choice and Best Music Video)</h2>
            <p>Here's another language project that I'm proud of, one that has nothing to do with software (but much to do with the fun spirit of learning a language!). I spent a week in school writing a love song in Chinese for bonus points in my class, and submitted this song to the Harvard Chinese Film Festival, winning two of the categories. I've done a few other language-based software engineering projects which can be seen in the 'projects' tab, but this is one that I feel like I can't leave out</p>
        </div>
    </section>
    <section class="container">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/uhIVctXiSjY?si=hcnIxHecC4Y_c2bp" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </section>
    <section class="container">
        <div class="text-section">
            <h2>Project 3: Sourcing software (Limited info - NDA)</h2>
            <p>This project shows my proficiency in managing large databases. I was hired as an independent contractor at a multi-million dollar consulting firm to build software that streamlines their sourcing process. I created software that helps gather and organize the company's data</p>
            <p><strong>My role:</strong> Worked as the software lead alongside the sourcing employees to implement their ideas with code. Predominantly used Python with Selenium to write a package that significantly optimizes their search for and reaching out to clientele.</p>
            <p><strong>Example(s) of iteration based on feedback:</strong> This tool started as a simple script that the sourcing employees could run, but feedback over multiple months pushed me to implement a GUI so that future employees could easily understand and interact with the system that was built. The goal of this project was longevity and consistency for this process as the company grows, so many of the changes reflected a desire for a more long-lasting piece of software that is user-friendly</p>
            <p><strong>Constraints or obstacles:</strong> Dealing with hundreds of thousands of data points was something that I had little to no experience with, so the modification and performing of tests on this data was an initial obstacle. There were many others present in the company who had dealt with such data, though, so their experience was a major help when trying to implement the database systems. The software is complete, although is this still an ongoing project as I'm still working with the company during sourcing season to make sure everything runs smoothly.</p>
        </div>
    </section>
</main>


