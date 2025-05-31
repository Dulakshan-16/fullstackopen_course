const Header = ({courseName}) => <h1>{courseName}</h1>

const Content = ({parts}) => {
    return (
          <div>
            {parts.map((part)=> <Part key={part.id} part={part}></Part>)}
  </div>
    )
}



const Part = ({part}) => {
    return (  <p>
    {part.name} {part.exercises}
  </p>)
}



const Total = ({total}) => <strong>Number of exercises {total}</strong>

const Course = ({course}) => {

    return (
        <>
        <Header courseName={course.name}></Header>
        <Content parts={course.parts}></Content>
        <Total total={course.parts.reduce((s,p)=> s + p.exercises, 0)}></Total>
        </>  
    )
}

export default Course;