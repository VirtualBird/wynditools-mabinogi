import {ingredientsData} from './cookingdata.js'
import './Cooking.css'

import React from "react"

export default function Cooking(){

    const [byNameIsChecked, setByNameIsChecked] = React.useState(true)
    const [byIngredientIsChecked, setByIngredientIsChecked] = React.useState(false)

    const [itemSearch, setItemSearch] = React.useState("")

    const [mainItem, setMainItem] = React.useState(null)
    const [recipeTree, setRecipeTree] = React.useState()

    React.useEffect(() => {

        function handleClick(event){
            //  If user clicked on item in ItemSearch List
            if (event.target.classList.contains('cooking-item-search-name')){
                console.log("Clicked item in list")
                handleItemSearchClick(event.target.dataset.name)
            }
        }

        document.addEventListener('click', handleClick)

        //  useEffect cleanup function
        return () => {
            console.log("Cleaning up click EventListener...")
            document.removeEventListener('click', handleClick)
        }

    }, [])

    function handleItemSearchClick(itemName){
        const itemObj = getIngredientObjByName(itemName)
        setMainItem(itemObj)

        // I suppose when you set a main item I should set everything to use recipe1 by default
        // I need to be able to go through the nested recipes and save that in state
        setRecipeTree(getRecipeTree(itemObj))
    }

    function getRecipeTree(itemObj, selected = "recipe1"){
        const recipe = {}
        // if recipe property exists
        if (itemObj?.recipe){
            // Check for instances of other recipes
            
            let recipeCounter = 0

            recipe["selected"] = selected

            if (itemObj.recipe.recipe1){
                recipe["recipe1"] = true
                recipeCounter ++
            }
            if (itemObj.recipe.recipe2){
                recipe["recipe2"] = true
                recipeCounter ++
            }
            if (itemObj.recipe.recipe3){
                recipe["recipe3"] = true
                recipeCounter ++
            }
            if (itemObj.recipe.recipe4){
                recipe["recipe4"] = true
                recipeCounter ++
            }
            if (itemObj.recipe.ingame){
                recipe["ingame"] = true
                recipeCounter ++
            }
            recipe["hasMultiple"] = recipeCounter > 1 ? true: false
            recipe["nested"] = []
            recipe["name"] = itemObj.name

            // console.log(itemObj.recipe[selected])

            if (itemObj.recipe[selected]){
                for (const ingredient of itemObj.recipe[selected]){
                    // console.log("this ingredient", ingredient)
                    const ingrObj = ingredientsData.find(item => {
                        return item.name === ingredient.name
                    })

                    // console.log("Found Item", ingredient.name, ingrObj, )
                    //if this item has recipe property

                    if (ingrObj && 'recipe' in ingrObj){
                        //I need to add a property of that nested uhh I'll use an obj
                        const nestedRecipe = getRecipeTree(ingrObj)
                        recipe["nested"].push(nestedRecipe)
                    }
                    else if(ingrObj){
                        const nestedRecipe = getRecipeTree(ingrObj)
                        recipe["nested"].push(nestedRecipe)
                    }
                    else // if ingrObj doesn't exist and all we have is a name
                    {
                        //  Just throw the ingredient name in there lmao
                        const nestedRecipe = getRecipeTree(ingredient.name)
                        recipe["nested"].push(nestedRecipe)
                    }
                }
            }            
            // console.log("Full Recipe Tree", recipe)
            return recipe
        }
        //  If a string was passed as itemObj, that means the ingredient we searched for doesn't exist in the cookingdata.js file
        else if(typeof itemObj === "string")
        {
            console.warn("Could not find ITEM in data: ", itemObj)
            recipe["hasMultiple"] = false
            recipe["name"] = itemObj
            return recipe
        }
        else{ //    If object doesn't have recipe property
            // console.log(`Item does not have recipe property: `, itemObj)
            recipe["hasMultiple"] = false
            recipe["name"] = itemObj?.name ? itemObj.name : "UNDEFINED ITEM"
            return recipe
        }
    }

    function handleOnChange(){
        setByNameIsChecked(prev => !prev)
    }

    function handleOnChangeByIngredient(){
        setByIngredientIsChecked(prev => !prev)
    }

    function handleSearchInput(value){
        setItemSearch(value)
    }


    //  Update Searchlist
    function renderItemSearchList()
    {
        // If Item Search field is not blank
        if (itemSearch){
            //  Find items based on search conditions and put it into an array
            const list = ingredientsData.filter((item) => 
            {
                const foundByName = byNameIsChecked ? item.name.toLowerCase().includes(itemSearch.toLowerCase()) : false
                // Implement by Ingredient later I can't do this yet
                //const foundByIngredient = byIngredientIsChecked ? false : false
                return foundByName
            })

            //  If we have an array of items
            if(list){
                //  return that list as elements
                const listElements = list.map((item) => {
                    return <li className="cooking-item-search-item" key={item.name}>
                        <div className="cooking-item-search-method" data-name={item.name}>{item.method ?? ''}</div>
                        <div className="cooking-item-search-name" data-name={item.name}>{item.name}</div>
                    </li>
                })

                return listElements
            }
            else
            {
                return <p>List does not exist?</p>
            }
        }
        else{
            return <p>Search Field is empty</p>
        }

        return <div>Item Search placeholder</div>
    }

    //  This is the main dish selected
    function renderMainDish(item){
        if (item){

            return <div className="cooking-main-item-content">
                {item.name ? <h2>{item.name}</h2> : <h2>Undefined Item Name</h2>}
                {item.method ? <p>{item.method}</p> : null}
                {/* {item.recipe ? : null} */}
            </div>
        }
        else{
            return <div className="cooking-main-item-content">
                <p>No Main Dish Selected</p>
                </div>
        }
    }

    function getIngredientObjByName(itemName){
        return ingredientsData.find(item => {
            if (item.name === itemName){
                return item
            }
        })
    }

    //  I guess I might need somekind of fancy state handling thing?
    function getIngredientTree(itemObj){
        console.log(itemObj)
    }

    //  Deprecated function was using to rearrange my ingredients data
    function reformatData(){
        return ingredientsData.map(item => {

            const recipeProperty = {}
            let changingRecipe = false
            //if recipe value exists
            if (item?.recipe){
                //check if the recipe value is an array
                changingRecipe = true
                if (Array.isArray(item.recipe))
                {
                    // I need to store it as another way
                    recipeProperty["recipe1"] = item.recipe
                }
            }
            if (item?.recipe2){
                if (Array.isArray(item.recipe2))
                {
                    recipeProperty["recipe2"] = item.recipe2
                }
            }
            if (item?.recipe3){
                if (Array.isArray(item.recipe3))
                {
                    recipeProperty["recipe3"] = item.recipe3
                }
            }
            if (item?.recipe4){
                if (Array.isArray(item.recipe4))
                {
                    recipeProperty["recipe4"] = item.recipe4
                }
            }
            
            if (item?.recipeInGame){
                if (Array.isArray(item.recipeInGame))
                {
                    recipeProperty["ingame"] = item.recipeInGame
                }
            }

            if (changingRecipe){
                const {recipeInGame, recipe2, recipe3, recipe4, ...itemWithoutOldRecipes} = item
                const newItem = {...itemWithoutOldRecipes, recipe: recipeProperty}
                return newItem
            }
            else
            {
                return item
            }
        })
    }

    function renderIngredientTree(recipeTree){
        // console.log(recipeTree)
        if (recipeTree)
        {
            // if going through a nested loop/property
            if (Array.isArray(recipeTree))
            {
                // console.log("This is an array ",recipeTree)
                // let displayElement = ""
                // //I suppose go through the loop
                // for(let item of recipeTree ){
                //     displayElement += <h2>{recipeTree.name}</h2>
                // }
                // console.log(displayElement)



                return <ul className="recipe-tree-list">{recipeTree.map(item => (
                    <li>
                        <span>{getRecipeMethod(item.name)}</span>
                        <p>{item.name}</p>
                        {renderIngredientTree(item.nested)}
                    </li>
                ))}</ul>
            }
            else
            {
                return <div className='recipe-tree'>
                    <h2 className="recipe-tree-title">Recipe Tree</h2>
                    <span>{getIngredientObjByName(recipeTree?.name).method}</span>
                    {recipeTree?.name ? <h3 className="recipe-tree-main-item">{recipeTree.name}</h3>: null}
                    {recipeTree?.nested ? <ul className="recipe-tree-main-list">{renderIngredientTree(recipeTree.nested)}</ul> : <div>{recipeTree.name}</div>}
                </div>
            }

        }
        else{
            return <></>
        }
    }

    //  Gets cooking method of cooking dish by name
    function getRecipeMethod(itemName){
        const itemObj = ingredientsData.find(item => {
            return item.name === itemName
        })

        if (itemObj){
            return itemObj.method
        }
        else
        {
            return ''
        }
    }

    return (
        <div className="cooking-page">
            <div className="container">
                <h2>Under construction, some features may be limited or broken</h2>
                <div className="cooking-search-options">
                    <p>Search Options</p>

                    <input type="checkbox" id="by-name" name="by-name" value={byNameIsChecked} checked={byNameIsChecked} onChange={handleOnChange}/>
                    <label htmlFor="by-name">By name</label>
                    <input type="checkbox" id="by-ingredient" name="by-ingredient" value={byIngredientIsChecked} checked={byIngredientIsChecked} onChange={handleOnChangeByIngredient}/>
                    <label htmlFor="by-ingredient">By ingredient</label>

                </div>

                <div className="cooking-item-search">
                    <label htmlFor="item-search">Item Search</label>
                    <input type="text" id="item-search" value={itemSearch} onChange={(e) => handleSearchInput(e.target.value)}/>

                    <ul className="cooking-item-search-list">
                        {renderItemSearchList()}
                    </ul>
                </div>

                <div className="cooking-main-item-content">
                    {renderMainDish(mainItem)}
                </div>

                {/* {console.log("Here is the full tree",recipeTree)} */}

                {renderIngredientTree(recipeTree)}
            </div>
        </div>
    )
}