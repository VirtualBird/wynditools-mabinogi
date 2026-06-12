import {ingredientsData} from '.././cookingdata.js'
import { getAllUniqueIngredientsFromRecipe } from '.././cookingUtils.js'

function divWrapper(jsxElement){
    return (
        <div className="cooking-item-search-list">
            {jsxElement}
        </div>
    )
}

export default function SearchList({searchInput, isListHidden, byNameIsChecked, byIngredientIsChecked}){
    
    let contents = null

    // If searchInput is not blank
    if (searchInput){
        // Find items based on search conditions and add to array.
        const list = ingredientsData.filter(item => {
            const foundByName = byNameIsChecked ? item.name.toLowerCase().includes(searchInput.toLowerCase()) : false
            // Implement by Ingredient later I can't do this yet

            let foundByIngredient = false
            //  If search by ingredient is checked
            if (byIngredientIsChecked){
                const uniqueItemsArr = getAllUniqueIngredientsFromRecipe(item?.recipe)
                //  Check if this item is used as an ingredient for any of array items's recipes.
                if (uniqueItemsArr){
                    foundByIngredient = uniqueItemsArr.some(
                        arrName => arrName.toLowerCase().startsWith(searchInput.toLowerCase())
                    )
                }

            }
            
            return foundByName || foundByIngredient
        })

        //  If we found any items
        if (list.length > 0){
            //  Return that list as elements
            //  but only if the search input is still focused
            if (!isListHidden){

                const listElements = list.map(item =>{
                     return <li className="cooking-item-search-item" key={item.name}>
                            <div className="cooking-item-search-method" data-name={item.name}>{item.method ?? ''}</div>
                            <div className="cooking-item-search-name" data-name={item.name}>{item.name}</div>
                        </li>
                })

                contents = <ul>
                    {listElements}
                </ul>
            }
            // If hiding List
            else{
                contents = <p>Hiding {list.length} items.</p>
            }
        }
        else{
            contents = <p>No results..</p>
        }
    }
    else{
        contents = <p>Search Field is empty</p>
    }

    return <div className="cooking-item-search-list">{contents}</div>
}
