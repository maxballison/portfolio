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
    }

    img {
        max-width: 100%;
        height: auto;
    }
</style>

<main>
    <h1>Application to Riot Games</h1>
    
    <!-- Project 1 -->
    <section class="container">
        <div class="text-section">
            <h2>Project 1: Gaming Community Platform</h2>
            <p><strong>Project brief:</strong> Developed a platform to connect gamers, focusing on improving user engagement and providing a seamless gaming experience. This project aligned with Riot's strategy of fostering gaming communities.</p>
            <p><strong>The team and your role:</strong> Collaborated with developers, designers, and product managers. My role was lead developer, focusing on back-end integration and user experience optimization.</p>
            <p><strong>Brief intro to your customers and their needs:</strong> Our primary customers were avid gamers looking for a comprehensive community experience. They needed a platform that was both user-friendly and feature-rich.</p>
            <p><strong>Your approach to the problem space:</strong> Utilized Agile methodologies, prioritizing user feedback and iterative design. Key decisions included adopting a microservices architecture and focusing on mobile responsiveness.</p>
            <p><strong>Example(s) of iteration based on feedback:</strong> One surprising feedback was the demand for real-time game updates. This led us to integrate live streaming features, significantly enhancing user engagement.</p>
            <p><strong>Constraints or obstacles:</strong> A major constraint was ensuring high performance during peak traffic, which we addressed through scalable cloud solutions.</p>
            <p><strong>Reflections:</strong> In hindsight, investing more in early user testing would have accelerated feature refinement.</p>
        </div>
        <div class="image-section">
            <img src="path-to-your-project1-image.jpg" alt="Gaming Community Platform Project">
        </div>
    </section>

    <!-- Project 2 -->
    <section class="container">
        <div class="text-section">
            <h2>Project 2: eSports Tournament Organizer</h2>
            <p><strong>Project brief:</strong> Created an eSports tournament organizing tool to streamline event management. This tool aligns with Riot's focus on eSports and competitive gaming.</p>
            <p><strong>The team and your role:</strong> Worked in a cross-functional team, including eSports experts. My role was UX/UI designer, ensuring the tool was intuitive and met the needs of tournament organizers.</p>
            <p><strong>Brief intro to your customers and their needs:</strong> Targeted at eSports organizers and participants, the tool needed to handle complex scheduling and live updates efficiently.</p>
            <p><strong>Your approach to the problem space:</strong> Emphasized user-centric design, integrating features like real-time bracket updates and participant communication channels.</p>
            <p><strong>Example(s) of iteration based on feedback:</strong> Feedback on the initial beta highlighted the need for enhanced mobile functionality, leading to a significant redesign for mobile-first use.</p>
            <p><strong>Constraints or obstacles:</strong> Balancing the depth of features with ease of use was challenging, requiring several iterations to get right.</p>
            <p><strong>Reflections:</strong> Looking back, more thorough competitor analysis would have provided valuable insights into feature prioritization.</p>
        </div>
        <div class="image-section">
            <img src="path-to-your-project2-image.jpg" alt="eSports Tournament Organizer Project">
        </div>
    </section>
</main>


