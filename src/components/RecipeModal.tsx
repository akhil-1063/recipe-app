import axios from "axios"
import { useEffect, useState } from "react"

interface MealDetail {
  strMeal: string
  strMealThumb: string
  strCategory: string
  strArea: string
  strInstructions: string
  strYoutube: string
  [key: string]: string
}

interface Props {
  id: string
  onClose: () => void
}

const RecipeModal = ({ id, onClose }: Props) => {
  const [meal, setMeal] = useState<MealDetail | null>(null)

  useEffect(() => {
    axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then((r) => {
      setMeal(r.data.meals?.[0] ?? null)
    })
  }, [id])

  const getIngredients = () => {
    if (!meal) return []
    const list = []
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`]
      const measure = meal[`strMeasure${i}`]
      if (ingredient?.trim()) {
        list.push(`${measure} ${ingredient}`.trim())
      }
    }
    return list
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        {!meal ? (
          <p>Loading...</p>
        ) : (
          <>
            <img src={meal.strMealThumb} alt={meal.strMeal} className="modal-img" />
            <h2>{meal.strMeal}</h2>
            <p>
              <span className="tag">{meal.strCategory}</span>
              <span className="tag">{meal.strArea}</span>
            </p>
            <h3>Ingredients</h3>
            <ul>
              {getIngredients().map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <h3>Instructions</h3>
            <p className="instructions">{meal.strInstructions}</p>
            {meal.strYoutube && (
              <a href={meal.strYoutube} target="_blank" rel="noreferrer">Youtube Link</a>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default RecipeModal
