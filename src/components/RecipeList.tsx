import axios from "axios"
import { useEffect, useState } from "react"
import RecipeModal from "./RecipeModal"

interface Meal {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory: string
  strArea: string
}

const RecipeList = () => {
  const [meals, setMeals] = useState<Meal[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  useEffect(() => {
    Promise.all([
      axios.get("https://www.themealdb.com/api/json/v1/1/search.php?f=b"),
      axios.get("https://www.themealdb.com/api/json/v1/1/search.php?f=c"),
      axios.get("https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian"),
    ]).then(([r1, r2, r3]) => {
      const bMeals = (r1.data.meals || []).slice(0, 10)
      const cMeals = (r2.data.meals || []).slice(0, 10)
      const indianMeals = (r3.data.meals || []).map((m: any) => ({
        ...m,
        strCategory: "",
        strArea: "Indian",
      }))
      const allMeals = [...bMeals, ...cMeals, ...indianMeals]
      const unique = allMeals.filter((meal, index, self) => self.findIndex(m => m.idMeal === meal.idMeal) === index)
      setMeals(unique)
    })

    axios.get("https://www.themealdb.com/api/json/v1/1/categories.php").then((r) => {
      const top10 = r.data.categories.slice(0, 10).map((c: any) => c.strCategory)
      setCategories(top10)
    })
  }, [])

  const filtered = meals.filter((meal) => {
    const nameMatch = meal.strMeal.toLowerCase().includes(search.toLowerCase())
    const categoryMatch = filterCategory ? meal.strCategory === filterCategory : true
    return nameMatch && categoryMatch
  })

  return (
    <>
      <section id="center">
        <h1>Akil's CookBook</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Search "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="ticks"></div>

      <div className="recipe-grid">
        {filtered.length === 0 ? (
          <p style={{ color: "var(--text)", padding: "32px" }}>No recipes found.</p>
        ) : (
          filtered.map((meal) => (
            <div key={meal.idMeal} className="recipe-card" onClick={() => setSelectedId(meal.idMeal)}>
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <p className="meal-name">{meal.strMeal}</p>
            </div>
          ))
        )}
      </div>

      <div className="ticks"></div>
      <section id="spacer"></section>

      {selectedId && <RecipeModal id={selectedId} onClose={() => setSelectedId(null)} />}
    </>
  )
}

export default RecipeList
