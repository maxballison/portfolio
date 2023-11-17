const projects = [
	{
		title: 'Dao',
		technologies: ['python', 'p5js', 'NRCLex', 'Tonejs'],
		description:
			'Dao is a data and music visualization of popular books and old philosophical Chinese texts. It uses a python sentiment analysis algorithm analyze the emotions present in a text and live draw pictures/create music based on the emotions in each section of the text',
		url: 'https://maxballison.github.io/Dao/'
	},
	{
		title: 'Notes on Love',
		technologies: ['Svelte', 'python', 'p5js', 'gpt4'],
		description:
			"Notes on Love is an appliation meant to categorize Harvard/MIT students' perspectives on Love. It uses a database of hundreds of love letters that a small team collected. I run each letter through an algorithm that uses gpt4 give the letter values for originality and positivity, and place the letter on a graph",
		url: 'https://maxballison.github.io/love-notes/'
	},
	{
		title: '3D Cellular Automata',
		technologies: ['C++', 'OpenGL'],
		description: "A three-dimensional cellular automata simulation using OpenGL",
		url: 'https://github.com/maxballison/CS175Final'
	}
];

export default projects;
