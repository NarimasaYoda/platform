import TinderCard from 'react-tinder-card'

const Tinder2 = () => {

  const onSwipe = (direction) => {
    console.log('You swiped: ' + direction)
  }

  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + ' left the screen')
  }

  return (
    <TinderCard className="title" onSwipe={onSwipe} onCardLeftScreen={() => onCardLeftScreen('fooBar')} preventSwipe={['right', 'left']}>Hello, World!</TinderCard>
  )
}

export default Tinder2


