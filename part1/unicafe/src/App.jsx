import { useState } from 'react'

const StatisticLine = ({text, value}) => {
  return <>
  <tr>
    <td>{text}</td> 
    <td>{value}</td>
  </tr>
    </>
}

const Statistics = ({good, neutral, bad}) => {

  const total = good + neutral + bad

  if (total === 0) {
    return <>
    <h1>statistics</h1>
    <p>No feedback given</p>
    </>
  }
  const avg = (good - bad) / total
  const positive = (good * 100) / total

  return <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good}></StatisticLine>
          <StatisticLine text="neutral" value={neutral}></StatisticLine>
          <StatisticLine text="bad" value={bad}></StatisticLine>
          <StatisticLine text="total" value={total}></StatisticLine>
          <StatisticLine text="average" value={avg}></StatisticLine>
          <StatisticLine text="positive" value={positive + "%"}></StatisticLine>
        </tbody>
      </table>

  </>

}

const Button = ({text, onClick}) => {
  return <><button onClick={onClick}>{text}</button></>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" onClick={() => setGood(good + 1)}></Button>
      <Button text="neutral" onClick={() => setNeutral(neutral + 1)}></Button>
      <Button text="bad" onClick={() => setBad(bad + 1)}></Button>
      <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
    </div>
  )
}

export default App