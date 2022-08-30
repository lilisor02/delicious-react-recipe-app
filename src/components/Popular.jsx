import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Link } from 'react-router-dom';
//1
// function that retrieves the data from the api
function Popular() {

  // popular is the current state
  // setPopular is used to update the current state
  const [popular, setPopular] = useState([])

  //running the function as soon as the component gets mounted
  useEffect(() => {
    getPopular();
  }, [])

  //using async to make sure that we have the data before rendering
  const getPopular = async () => {

    // if the data is in the local storage, we won't be fetching it anymore
    const check = localStorage.getItem('popular');

    // converting the data from a string to a javascript object
    if (check) {
      setPopular(JSON.parse(check));
    }
    // if there isn't anything in the local storage, we're setting and fetching the api
    else {
      const api = await fetch(
        `https://api.spoonacular.com/recipes/random?apiKey=${process.env.REACT_APP_API_KEY}&number=9`
      );
      // converting the response to a json
      const data = await api.json();

      /*
      adding the 'popular' key to the local storage, and setting it's value to the
      recipes from the api converted to a string
      */
      localStorage.setItem('popular', JSON.stringify(data.recipes));

      // updating the state of 'popular' to the recipies from the api
      setPopular(data.recipes)

      // logging the recipes
      console.log(data.recipes)
    }
  }

  // looping through each recipe and outputting it
  return (
    <div>
      <Wrapper>
        <h3>Popular Picks</h3>
        <Splide options={{
          perPage: 4,
          arrows: false,
          pagination: false,
          drag: 'free',
          gap: '5rem'
        }}
        >
          {popular.map((recipe) => {
            return (
              <SplideSlide key={recipe.id}>
                <Card>
                  <Link to={"/recipe/" + recipe.id}>
                    <p>{recipe.title}</p>
                    <img src={recipe.image} alt={recipe.title} />
                    <Gradient />
                  </Link>
                </Card>
              </SplideSlide>
            );
          })}
        </Splide>
      </Wrapper>
    </div>
  )
}

// the style of the wrapper that contains all of the cards
const Wrapper = styled.div`
  margin: 4rem 0rem;
`;

// the style of the cards that contain the recipes
const Card = styled.div`
  min-height: 25rem;
  border-radius: 2rem;
  over-flow: hidden;
  position: relative;

  img {
    border-radius: 2rem;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  p {
    position: absolute;
    z-index: 10;
    left: 50%;
    bottom: 0%;
    transform: translate(-50%, 0%);
    color: white;
    width: 100%;
    text-align: center;
    font-weight: 600;
    font-size: 1rem;
    height: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

// the style for the gradient of the cards
const Gradient = styled.div`
  z-index: 3;
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.5));
  border-radius: 2rem;
`;

export default Popular
