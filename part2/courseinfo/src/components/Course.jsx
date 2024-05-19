const Header = ({ course }) => <h1>{course}</h1>;

const Total = ({ sum }) => <b>total of {sum} exercises</b>;

const Part = ({ part }) => (
	<p>
		{part.name} {part.exercises}
	</p>
);

const Content = ({ parts }) => (
	<>
		{parts.map((part) => (
			<Part key={part.id} part={part} />
		))}
	</>
);

const Course = ({ course }) => {
	let parts = course.parts;

	return (
		<div>
			<Header course={course.name} />
			<Content parts={parts} />
			<Total
				sum={parts.reduce(
					(accumulator, part) => accumulator + part.exercises,
					0
				)}
			/>
		</div>
	);
};

export default Course