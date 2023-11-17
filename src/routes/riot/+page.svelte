<svelte:head>
	<title>Max Allison — Riot</title>
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
    <h1>Riot Games</h1>
    
    <!-- Project 1 -->
    <section class="container">
        <div class="text-section">
            <h2>Project 1: Dao</h2>
            <p><strong>Project brief:</strong> Developed a platform to convert philosophical texts and movie scripts into a musical composition based on the emotions present in the work. The goal is to have a more digestable way of interacting with these texts, seeing and hearing a summary of these works within a short period of time.</p>
            <p><strong>My role:</strong> I developed the entirety of this system, writing python scripts for preprocessing and javascript for the music and graphics</p>
            <p><strong>Brief intro to your audience:</strong> This project was put on public display at Harvard's Science and Engineering Complex for a conference on Data Visualization. The goal was to create innovative ways of visualizing big data.</p>
            <p><strong>Your approach to the problem space:</strong> This project went through multiple stages of consumer testing, where the audience had to rate how well they were understanding the data being presented to them. This allowed for an iterative design where processing, graphics, and music were changed multiple times. For example, the graphics started out much simpler and didn't really paint an image of what was going on in the text, but this design element was improved upon after feedback.</p>
            <p><strong>Constraints or obstacles:</strong> A major constraint was working with the pre-existing sentiment analysis methods to get accurate results. Much testing was done to figure out whether the percentage of emotions represented on the screen accurately corresponded to the underlying themes of the plot or philosophy.</p>
            <p><strong>Reflections:</strong> In hindsight, I could've come up with a more quantitative way to display the sentiment analysis data, but the final product was well-received and represents a unique collaboration between technology and art</p>
        </div>
    </section>
    <section class="container">
        <div class="text-section">
            <p>This is the first iteration of the application. The graphics are very simple, but the density of the different colored circles represents the frequency of the different emotions in the text (red is anger, blue is sadness, etc.) </p>
        </div>
        <div class ="image-section">
            <img src="dao1.png">
        </div>
    </section>
    <section class="container">
        <div class ="image-section">
            <img src="dao2.png">
        </div>
        <div class="text-section">
            <p>This is the final iteration of the design</p>
        </div>
    </section>

    <section class="container">
        <div class="text-section">
            <a href="https://maxballison.github.io/Dao/">Here's the final site</a>
        </div>
    </section>

    <!-- Project 2 -->
    <section class="container">
        <div class="text-section">
            <h2>Project 2: Sourcing software (Limited info - NDA)</h2>
            <p><strong>Project brief:</strong> Hired as an independent contractor at a multi-million dollar consulting firm to build software that streamlines their sourcing process. Created software that helps gather and organize the company's data</p>
            <p><strong>My role:</strong> Worked as the software lead alongside the sourcing employees to implement their ideas with code</p>
            <p><strong>Example(s) of iteration based on feedback:</strong> This tool started as a simple script that the sourcing employees could run, but initial feedback pushed me to implement a GUI so that future employees could easily understand and interact with the system that was built</p>
            <p><strong>Constraints or obstacles:</strong> Dealing with hundreds of thousands of data points was something that I had little to no experience with, so the modification of this data was an initial obstacle</p>
        </div>
    </section>
</main>


