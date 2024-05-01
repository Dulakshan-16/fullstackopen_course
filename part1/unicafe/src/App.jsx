import { useState } from "react";

const Button = ({ handleClick, text }) => (
	<button onClick={handleClick}>{text}</button>
);

const Feedback = ({ handleGoodClick, handleNeutralClick, handleBadClick }) => {
	return (
		<div>
			<h1>give feedback</h1>
			<Button handleClick={handleGoodClick} text="good"></Button>
			<Button handleClick={handleNeutralClick} text="neutral"></Button>
			<Button handleClick={handleBadClick} text="bad"></Button>
		</div>
	);
};

const StatisticLine = ({ text, value }) => (
	<>
		<tr>
			<td>{text}</td>
			<td>{value}</td>
		</tr>
	</>
);

const Statistics = ({ stats }) => {
	if (stats.total == 0) {
		return (
			<div>
				<h1>statistics</h1>
				<p>No feedback given</p>
			</div>
		);
	}

	return (
		<div>
			<h1>statistics</h1>
			<table>
				<StatisticLine text="good" value={stats.good} />
				<StatisticLine text="neutral" value={stats.neutral} />
				<StatisticLine text="bad" value={stats.bad} />
				<StatisticLine text="all" value={stats.total} />
				<StatisticLine text="average" value={stats.average} />
				<StatisticLine text="positive" value={stats.positive + " %"} />
			</table>
		</div>
	);
};

const App = () => {
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);
	const [total, setTotal] = useState(0);
	const [average, setAverage] = useState(0);
	const [positive, setPositive] = useState(0);

	const calculateAvg = (good, bad, total) => {
		let avgScore = (good - bad) / total;
		setAverage(avgScore);
	};

	const handleGoodClick = () => {
		let updatedGood = good + 1;
		let updatedTotal = total + 1;

		setGood(updatedGood);

		setTotal(updatedTotal);

		calculateAvg(good + 1, bad, updatedTotal);

		setPositive((updatedGood * 100) / updatedTotal);
	};

	const handleNeutralClick = () => {
		let updatedTotal = total + 1;

		setNeutral(neutral + 1);
		setTotal(total + 1);

		calculateAvg(good, bad, updatedTotal);

		setPositive((good * 100) / updatedTotal);
	};

	const handleBadClick = () => {
		let updatedTotal = total + 1;

		setBad(bad + 1);

		setTotal(total + 1);

		calculateAvg(good, bad + 1, updatedTotal);

		setPositive((good * 100) / updatedTotal);
	};

	return (
		<div>
			<Feedback
				handleGoodClick={handleGoodClick}
				handleNeutralClick={handleNeutralClick}
				handleBadClick={handleBadClick}
			></Feedback>
			<Statistics
				stats={{
					good: good,
					neutral: neutral,
					bad: bad,
					total: total,
					average: average,
					positive: positive,
				}}
			></Statistics>
		</div>
	);
};

export default App;
