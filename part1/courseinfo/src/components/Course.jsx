const Header = ({ course }) => {
	return <h1>{course}</h1>;
};

const Part = ({ part, exercise }) => {
	return (
		<p>
			{part} {exercise}
		</p>
	);
};

const Content = ({ parts }) => {
	return (
		<div>
			{parts.map((part) => (
				<Part key={part.id} part={part.name} exercise={part.exercises} />
			))}
		</div>
	);
};

const Total = ({ parts }) => {
	return (
		<p>
			<b>total of {parts.reduce((sum, part) => (sum += part.exercises), 0)}</b>
		</p>
	);
};

const Course = ({ course }) => {
	return (
		<div key={course.id}>
			<Header course={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</div>
	);
};

export default Course